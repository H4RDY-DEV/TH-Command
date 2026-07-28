import {getJobs,saveJobs,nextJobId} from '../core/store.js';
import {money,date,badge,toast,escapeHtml} from '../core/ui.js';

let filterText='';
let filterStatus='All';

export function renderJobs(){
  const jobs=getJobs();
  const filtered=jobs.filter(job=>{
    const haystack=`${job.id} ${job.title} ${job.client} ${job.venue}`.toLowerCase();
    return haystack.includes(filterText.toLowerCase()) && (filterStatus==='All'||job.status===filterStatus);
  });

  queueMicrotask(bindJobsEvents);
  return `
    <section class="page-heading">
      <div><p class="eyebrow">Jobs module</p><h1>Jobs</h1><p>Create, track and manage event production work.</p></div>
      <div class="actions"><button class="button primary" id="new-job">+ New job</button></div>
    </section>
    <div class="toolbar">
      <input id="job-search" type="search" placeholder="Search jobs, clients or venues…" value="${escapeHtml(filterText)}">
      <select id="job-status-filter">
        ${['All','Enquiry','Quoted','Confirmed','Completed','Cancelled'].map(s=>`<option ${s===filterStatus?'selected':''}>${s}</option>`).join('')}
      </select>
    </div>
    <section class="panel">
      ${filtered.length ? `<div class="table-wrap"><table>
        <thead><tr><th>Job</th><th>Client</th><th>Venue</th><th>Start</th><th>Status</th><th>Value</th><th></th></tr></thead>
        <tbody>${filtered.map(job=>`<tr>
          <td><strong>${escapeHtml(job.title)}</strong><br><small class="muted">${job.id}</small></td>
          <td>${escapeHtml(job.client)}</td><td>${escapeHtml(job.venue)}</td><td>${date(job.start)}</td>
          <td>${badge(job.status)}</td><td>${money(job.value)}</td>
          <td><button class="button small edit-job" data-id="${job.id}">Edit</button></td>
        </tr>`).join('')}</tbody></table></div>` : `<div class="empty-state"><h3>No jobs found</h3><p>Adjust your filters or create a new job.</p></div>`}
    </section>`;
}

function bindJobsEvents(){
  document.querySelector('#new-job')?.addEventListener('click',()=>openJobModal());
  document.querySelectorAll('.edit-job').forEach(btn=>btn.addEventListener('click',()=>openJobModal(btn.dataset.id)));
  document.querySelector('#job-search')?.addEventListener('input',e=>{filterText=e.target.value; window.dispatchEvent(new Event('th:rerender'));});
  document.querySelector('#job-status-filter')?.addEventListener('change',e=>{filterStatus=e.target.value; window.dispatchEvent(new Event('th:rerender'));});

  const params=new URLSearchParams(location.hash.split('?')[1]||'');
  if(params.get('action')==='new'){
    history.replaceState(null,'','#jobs');
    openJobModal();
  }
}

function openJobModal(id=null){
  const jobs=getJobs();
  const existing=jobs.find(j=>j.id===id);
  const job=existing||{id:nextJobId(jobs),title:'',client:'',venue:'',start:'',end:'',status:'Enquiry',value:'',manager:'Tyler',notes:''};
  const wrap=document.createElement('div');
  wrap.className='modal-backdrop';
  wrap.innerHTML=`<form class="modal" id="job-form">
    <div class="modal-head"><div><p class="eyebrow">${existing?'Edit job':'New job'}</p><h2 style="margin:0">${job.id}</h2></div><button type="button" class="button small" data-close>Close</button></div>
    <div class="modal-body"><div class="form-grid">
      <label class="full">Job title<input name="title" value="${escapeHtml(job.title)}" required></label>
      <label>Client<input name="client" value="${escapeHtml(job.client)}" required></label>
      <label>Venue<input name="venue" value="${escapeHtml(job.venue)}" required></label>
      <label>Start date<input name="start" type="date" value="${job.start}" required></label>
      <label>End date<input name="end" type="date" value="${job.end||job.start}" required></label>
      <label>Status<select name="status">${['Enquiry','Quoted','Confirmed','Completed','Cancelled'].map(s=>`<option ${s===job.status?'selected':''}>${s}</option>`).join('')}</select></label>
      <label>Job value (£)<input name="value" type="number" min="0" step="0.01" value="${job.value}"></label>
      <label>Project manager<input name="manager" value="${escapeHtml(job.manager)}"></label>
      <label class="full">Notes<textarea name="notes">${escapeHtml(job.notes)}</textarea></label>
    </div></div>
    <div class="modal-foot">${existing?'<button type="button" class="button danger" id="delete-job">Delete</button>':''}<button type="button" class="button" data-close>Cancel</button><button class="button primary" type="submit">Save job</button></div>
  </form>`;
  document.body.appendChild(wrap);
  wrap.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>wrap.remove());
  wrap.addEventListener('click',e=>{if(e.target===wrap)wrap.remove()});
  wrap.querySelector('#job-form').onsubmit=e=>{
    e.preventDefault();
    const data=Object.fromEntries(new FormData(e.currentTarget));
    const updated={...job,...data,value:Number(data.value||0)};
    const next=existing?jobs.map(j=>j.id===id?updated:j):[updated,...jobs];
    saveJobs(next); wrap.remove(); toast(existing?'Job updated':'Job created'); window.dispatchEvent(new Event('th:rerender'));
  };
  wrap.querySelector('#delete-job')?.addEventListener('click',()=>{
    if(confirm(`Delete ${job.id} – ${job.title}?`)){
      saveJobs(jobs.filter(j=>j.id!==id)); wrap.remove(); toast('Job deleted'); window.dispatchEvent(new Event('th:rerender'));
    }
  });
}
