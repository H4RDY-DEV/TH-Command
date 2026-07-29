import {getJobs, saveJobs, nextJobId} from '../core/store.js';
import {money, date, badge, toast, escapeHtml} from '../core/ui.js';
import {HistoryService} from '../services/history.js';

const STATUSES = ['Enquiry', 'Quoted', 'Confirmed', 'Loading', 'Dispatched', 'On Site', 'Returning', 'Completed', 'Cancelled'];
let state = {query: '', status: ''};

export function filterJobs(jobs = [], query = '', status = '') {
  const q = String(query).trim().toLowerCase();
  return jobs.filter(job => {
    const matchesStatus = !status || job.status === status;
    const haystack = [job.id, job.title, job.client, job.venue, job.manager, job.status]
      .map(value => String(value || '').toLowerCase())
      .join(' ');
    return matchesStatus && (!q || haystack.includes(q));
  });
}

export function renderJobs() {
  queueMicrotask(bindJobsPage);
  return jobsPageHtml();
}

function jobsPageHtml() {
  const jobs = getJobs();
  const filtered = filterJobs(jobs, state.query, state.status);
  const active = jobs.filter(job => !['Completed', 'Cancelled'].includes(job.status)).length;
  const confirmed = jobs.filter(job => job.status === 'Confirmed').length;
  const pipeline = jobs.filter(job => !['Completed', 'Cancelled'].includes(job.status))
    .reduce((sum, job) => sum + Number(job.value || 0), 0);

  return `
    <section class="page-heading">
      <div><p class="eyebrow">Job management</p><h1>Jobs</h1><p>Create, edit and track every production job.</p></div>
      <div class="actions"><button class="button primary" id="new-job">+ New job</button></div>
    </section>
    <section class="metric-grid jobs-metrics">
      <article class="metric"><div class="metric-label">Total jobs</div><div class="metric-value">${jobs.length}</div><div class="metric-note">All saved records</div></article>
      <article class="metric"><div class="metric-label">Active jobs</div><div class="metric-value">${active}</div><div class="metric-note">Excludes completed and cancelled</div></article>
      <article class="metric"><div class="metric-label">Confirmed</div><div class="metric-value">${confirmed}</div><div class="metric-note">Ready for production</div></article>
      <article class="metric"><div class="metric-label">Pipeline</div><div class="metric-value">${money(pipeline)}</div><div class="metric-note">Current active value</div></article>
    </section>
    <section class="panel">
      <div class="panel-body">
        <div class="toolbar jobs-toolbar">
          <input id="job-search" type="search" value="${escapeHtml(state.query)}" placeholder="Search job, client, venue or manager…" aria-label="Search jobs">
          <select id="job-status-filter" aria-label="Filter by status">
            <option value="">All statuses</option>
            ${STATUSES.map(status => `<option value="${escapeHtml(status)}" ${state.status === status ? 'selected' : ''}>${escapeHtml(status)}</option>`).join('')}
          </select>
          <span class="muted jobs-result-count">${filtered.length} result${filtered.length === 1 ? '' : 's'}</span>
        </div>
        <div id="jobs-list">${jobsTableHtml(filtered)}</div>
      </div>
    </section>`;
}

function jobsTableHtml(jobs) {
  if (!jobs.length) return `<div class="empty-state"><strong>No matching jobs.</strong><br><span>Adjust the filters or create a new job.</span></div>`;
  return `<div class="table-wrap"><table class="jobs-table">
    <thead><tr><th>Job</th><th>Client / Venue</th><th>Dates</th><th>Status</th><th>Value</th><th></th></tr></thead>
    <tbody>${jobs.map(job => `<tr>
      <td><strong>${escapeHtml(job.title || 'Untitled job')}</strong><br><small class="muted">${escapeHtml(job.id)}</small></td>
      <td>${escapeHtml(job.client || '—')}<br><small class="muted">${escapeHtml(job.venue || 'No venue')}</small></td>
      <td>${date(job.start)}<br><small class="muted">to ${date(job.end)}</small></td>
      <td>${badge(escapeHtml(job.status || 'Enquiry'))}</td>
      <td>${money(job.value)}</td>
      <td class="job-actions"><button class="button small" data-edit-job="${escapeHtml(job.id)}">Edit</button><button class="button small danger" data-delete-job="${escapeHtml(job.id)}">Delete</button></td>
    </tr>`).join('')}</tbody>
  </table></div>`;
}

function bindJobsPage() {
  const root = document.querySelector('#view');
  if (!root) return;

  root.querySelector('#new-job')?.addEventListener('click', () => openJobModal());
  root.querySelector('#job-search')?.addEventListener('input', event => {
    state.query = event.target.value;
    refreshList();
  });
  root.querySelector('#job-status-filter')?.addEventListener('change', event => {
    state.status = event.target.value;
    refreshList();
  });
  root.addEventListener('click', handleJobsClick);

  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  if (params.get('action') === 'new') {
    history.replaceState(null, '', '#jobs');
    openJobModal();
  }
}

function handleJobsClick(event) {
  const editButton = event.target.closest('[data-edit-job]');
  if (editButton) return openJobModal(editButton.dataset.editJob);

  const deleteButton = event.target.closest('[data-delete-job]');
  if (deleteButton) deleteJob(deleteButton.dataset.deleteJob);
}

function refreshList() {
  const jobs = filterJobs(getJobs(), state.query, state.status);
  const list = document.querySelector('#jobs-list');
  const count = document.querySelector('.jobs-result-count');
  if (list) list.innerHTML = jobsTableHtml(jobs);
  if (count) count.textContent = `${jobs.length} result${jobs.length === 1 ? '' : 's'}`;
}

function openJobModal(jobId = '') {
  const jobs = getJobs();
  const existing = jobs.find(job => job.id === jobId);
  const job = existing || {
    id: nextJobId(jobs), title: '', client: '', venue: '', start: '', end: '',
    status: 'Enquiry', value: '', manager: 'Tyler', notes: ''
  };

  closeModal();
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'job-modal';
  backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="job-modal-title">
    <div class="modal-head"><div><p class="eyebrow">${existing ? 'Update record' : 'Create record'}</p><h2 id="job-modal-title">${existing ? 'Edit job' : 'New job'}</h2></div><button class="button small" type="button" data-close-modal>Close</button></div>
    <form id="job-form">
      <div class="modal-body"><div class="form-grid">
        <label><span>Job number</span><input name="id" value="${escapeHtml(job.id)}" required></label>
        <label><span>Status</span><select name="status">${STATUSES.map(status => `<option ${job.status === status ? 'selected' : ''}>${escapeHtml(status)}</option>`).join('')}</select></label>
        <label class="full"><span>Job name</span><input name="title" value="${escapeHtml(job.title)}" required autofocus></label>
        <label><span>Client</span><input name="client" value="${escapeHtml(job.client)}" required></label>
        <label><span>Venue</span><input name="venue" value="${escapeHtml(job.venue)}"></label>
        <label><span>Start date</span><input name="start" type="date" value="${escapeHtml(job.start)}"></label>
        <label><span>Finish date</span><input name="end" type="date" value="${escapeHtml(job.end)}"></label>
        <label><span>Project manager</span><input name="manager" value="${escapeHtml(job.manager)}"></label>
        <label><span>Job value (£)</span><input name="value" type="number" min="0" step="0.01" value="${escapeHtml(job.value)}"></label>
        <label class="full"><span>Notes</span><textarea name="notes" rows="4">${escapeHtml(job.notes)}</textarea></label>
      </div></div>
      <div class="modal-foot"><button class="button" type="button" data-close-modal>Cancel</button><button class="button primary" type="submit">${existing ? 'Save changes' : 'Create job'}</button></div>
    </form>
  </div>`;
  document.body.appendChild(backdrop);

  backdrop.addEventListener('click', event => {
    if (event.target === backdrop || event.target.closest('[data-close-modal]')) closeModal();
  });
  backdrop.querySelector('#job-form').addEventListener('submit', event => saveJob(event, existing?.id));
  backdrop.querySelector('[autofocus]')?.focus();
}

function saveJob(event, originalId) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const jobs = getJobs();
  const record = {
    id: String(form.get('id') || '').trim(),
    title: String(form.get('title') || '').trim(),
    client: String(form.get('client') || '').trim(),
    venue: String(form.get('venue') || '').trim(),
    start: String(form.get('start') || ''),
    end: String(form.get('end') || ''),
    status: String(form.get('status') || 'Enquiry'),
    value: Number(form.get('value') || 0),
    manager: String(form.get('manager') || '').trim(),
    notes: String(form.get('notes') || '').trim()
  };

  if (!record.id || !record.title || !record.client) return toast('Job number, name and client are required.');
  if (jobs.some(job => job.id === record.id && job.id !== originalId)) return toast('That job number is already in use.');

  const index = jobs.findIndex(job => job.id === originalId);
  if (index >= 0) jobs[index] = {...jobs[index], ...record, modified: new Date().toISOString()};
  else jobs.unshift({...record, created: new Date().toISOString(), modified: new Date().toISOString()});

  saveJobs(jobs);
  HistoryService.log(index >= 0 ? 'job.updated' : 'job.created', {jobId: record.id, title: record.title, status: record.status});
  closeModal();
  toast(index >= 0 ? 'Job updated.' : 'Job created.');
  window.dispatchEvent(new Event('th:rerender'));
}

function deleteJob(jobId) {
  const jobs = getJobs();
  const job = jobs.find(item => item.id === jobId);
  if (!job || !confirm(`Delete ${job.id} — ${job.title}? This cannot be undone.`)) return;
  saveJobs(jobs.filter(item => item.id !== jobId));
  HistoryService.log('job.deleted', {jobId: job.id, title: job.title});
  toast('Job deleted.');
  window.dispatchEvent(new Event('th:rerender'));
}

function closeModal() {
  document.querySelector('#job-modal')?.remove();
}


// v9.1.5 helpers
export function sortJobsByDate(jobs=[]){
 return [...jobs].sort((a,b)=>new Date(a.startDate||0)-new Date(b.startDate||0));
}
export function jobSummary(jobs=[]){
 return {
   total: jobs.length,
   complete: jobs.filter(j=>j.status==='Complete').length,
   active: jobs.filter(j=>!['Complete','Cancelled'].includes(j.status)).length
 };
}
