import {getJobs} from '../core/store.js';
import {money,date,badge} from '../core/ui.js';

export function renderDashboard(){
  const jobs=getJobs();
  const confirmed=jobs.filter(j=>j.status==='Confirmed');
  const pipeline=jobs.filter(j=>!['Completed','Cancelled'].includes(j.status)).reduce((s,j)=>s+Number(j.value||0),0);
  const upcoming=[...jobs].filter(j=>new Date(j.start)>=new Date(new Date().toDateString())).sort((a,b)=>a.start.localeCompare(b.start)).slice(0,5);

  return `
    <section class="page-heading">
      <div><p class="eyebrow">Operations overview</p><h1>Dashboard</h1><p>Live view of jobs, revenue pipeline and upcoming activity.</p></div>
      <div class="actions"><a class="button primary" href="#jobs?action=new">+ New job</a></div>
    </section>
    <section class="metric-grid">
      <article class="metric"><div class="metric-label">Active jobs</div><div class="metric-value">${jobs.filter(j=>!['Completed','Cancelled'].includes(j.status)).length}</div><div class="metric-note">Across all live stages</div></article>
      <article class="metric"><div class="metric-label">Confirmed</div><div class="metric-value">${confirmed.length}</div><div class="metric-note">Ready for production</div></article>
      <article class="metric"><div class="metric-label">Pipeline value</div><div class="metric-value">${money(pipeline)}</div><div class="metric-note">Enquiries, quotes and confirmed</div></article>
      <article class="metric"><div class="metric-label">Assets available</div><div class="metric-value">128</div><div class="metric-note">Demo inventory figure</div></article>
    </section>
    <section class="grid-2">
      <article class="panel">
        <div class="panel-head"><h2>Upcoming jobs</h2><a class="button small" href="#jobs">View all</a></div>
        ${upcoming.length ? `<div class="table-wrap"><table><thead><tr><th>Job</th><th>Date</th><th>Client</th><th>Status</th><th>Value</th></tr></thead><tbody>
          ${upcoming.map(j=>`<tr><td><strong>${j.title}</strong><br><small class="muted">${j.id}</small></td><td>${date(j.start)}</td><td>${j.client}</td><td>${badge(j.status)}</td><td>${money(j.value)}</td></tr>`).join('')}
        </tbody></table></div>` : `<div class="empty-state">No upcoming jobs.</div>`}
      </article>
      <article class="panel">
        <div class="panel-head"><h2>Production alerts</h2></div>
        <div class="panel-body list-stack">
          <div class="list-item"><div><strong>Warehouse prep</strong><small>1 confirmed job needs a prep list.</small></div><span class="badge quoted">Action</span></div>
          <div class="list-item"><div><strong>Asset service</strong><small>4 assets due for inspection.</small></div><span class="badge enquiry">Review</span></div>
          <div class="list-item"><div><strong>Crew availability</strong><small>2 upcoming dates need crew confirmation.</small></div><span class="badge confirmed">Open</span></div>
        </div>
      </article>
    </section>`;
}
