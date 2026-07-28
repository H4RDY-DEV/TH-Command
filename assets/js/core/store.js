const JOBS_KEY = 'th_command_jobs_v1';

const starterJobs = [
  {id:'JOB-1001',title:'Leicester Pride Afterparty',client:'Example Events Ltd',venue:'Leicester City Centre',start:'2026-08-29',end:'2026-08-30',status:'Confirmed',value:6450,manager:'Tyler',notes:'Lighting, audio and control package.'},
  {id:'JOB-1002',title:'Corporate Awards Dinner',client:'Northstar Group',venue:'The City Rooms',start:'2026-09-12',end:'2026-09-12',status:'Quoted',value:3850,manager:'Tyler',notes:'Stage, uplighting and PA.'},
  {id:'JOB-1003',title:'Autumn Club Installation',client:'Venue Client',venue:'Leicester',start:'2026-09-21',end:'2026-09-24',status:'Enquiry',value:9200,manager:'Tyler',notes:'Permanent smart LED and DMX installation.'}
];

export function getJobs(){
  const saved = localStorage.getItem(JOBS_KEY);
  if (!saved) {
    localStorage.setItem(JOBS_KEY, JSON.stringify(starterJobs));
    return structuredClone(starterJobs);
  }
  try { return JSON.parse(saved); } catch { return structuredClone(starterJobs); }
}

export function saveJobs(jobs){
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function nextJobId(jobs){
  const max = jobs.reduce((value, job) => Math.max(value, Number(String(job.id).replace(/\D/g,'')) || 1000), 1000);
  return `JOB-${max + 1}`;
}
