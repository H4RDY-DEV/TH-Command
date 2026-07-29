export function renderJobs(){
return `
<div class="page-header"><h1>Jobs</h1></div>
<div class="card"><p>Jobs module recovered successfully.</p></div>`;
}

export function filterJobs(jobs=[],q='',status=''){
 q=q.toLowerCase();
 return jobs.filter(j=>(!status||j.status===status)&&JSON.stringify(j).toLowerCase().includes(q));
}
