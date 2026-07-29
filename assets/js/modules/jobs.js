// v9.0.7 patch
export function filterJobs(jobs,q,status){
 q=(q||'').toLowerCase();
 return jobs.filter(j=>(!status||j.status===status)&&JSON.stringify(j).toLowerCase().includes(q));
}
document.dispatchEvent(new CustomEvent('jobs:updated'));
