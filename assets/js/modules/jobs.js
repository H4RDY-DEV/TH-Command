export function renderJobs(){
  const root=document.getElementById('view')||document.getElementById('app')||document.querySelector('main');
  if(!root) return;
  root.innerHTML=`<section class="page"><h1>Jobs</h1><p>Jobs module restored. Existing functionality can now be rebuilt safely.</p></section>`;
}
export function filterJobs(jobs=[],q='',status=''){
 q=(q||'').toLowerCase();
 return jobs.filter(j=>(!status||j.status===status)&&JSON.stringify(j).toLowerCase().includes(q));
}
