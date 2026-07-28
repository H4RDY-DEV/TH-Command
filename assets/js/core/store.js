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


const ASSETS_KEY = 'th_command_assets_v1';

const starterAssets = [
  {id:'AST-1001',name:'ROBE MegaPointe',category:'Lighting',manufacturer:'ROBE',model:'MegaPointe',serial:'MP-TH-001',quantity:4,available:4,status:'Available',location:'Lighting Bay A',purchaseDate:'2025-04-18',serviceDue:'2026-10-01',dailyRate:145,notes:'Flightcased in pairs.'},
  {id:'AST-1002',name:'Claypaky Mythos 2',category:'Lighting',manufacturer:'Claypaky',model:'Mythos 2',serial:'MY-TH-001',quantity:8,available:6,status:'Part Allocated',location:'Lighting Bay A',purchaseDate:'2024-11-03',serviceDue:'2026-09-15',dailyRate:125,notes:'Two units allocated to JOB-1001.'},
  {id:'AST-1003',name:'D&B C4 Subwoofer',category:'Audio',manufacturer:'D&B Audiotechnik',model:'C4-SUB',serial:'C4S-TH-001',quantity:4,available:4,status:'Available',location:'Audio Bay B',purchaseDate:'2023-06-12',serviceDue:'2026-11-20',dailyRate:85,notes:'Use with XTA processor and MC2 amplification.'},
  {id:'AST-1004',name:'LS 10” Full Range Top',category:'Audio',manufacturer:'LS',model:'10 Full Range',serial:'LS10-TH-001',quantity:4,available:4,status:'Available',location:'Audio Bay B',purchaseDate:'2024-02-20',serviceDue:'2026-12-05',dailyRate:65,notes:''},
  {id:'AST-1005',name:'grandMA3 Compact XT',category:'Control',manufacturer:'MA Lighting',model:'grandMA3 Compact XT',serial:'MA3-TH-001',quantity:1,available:1,status:'Available',location:'Control Store',purchaseDate:'2025-01-30',serviceDue:'2027-01-30',dailyRate:350,notes:'Primary lighting control console.'},
  {id:'AST-1006',name:'Pixel LED Batten',category:'LED / Pixel',manufacturer:'TH Technical',model:'Custom Pixel Batten',serial:'PX-TH-001',quantity:24,available:18,status:'Part Allocated',location:'LED Bay C',purchaseDate:'2025-08-11',serviceDue:'2026-08-11',dailyRate:28,notes:'Address through custom TH Technical DMX software.'}
];

export function getAssets(){
  const saved = localStorage.getItem(ASSETS_KEY);
  if (!saved) {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(starterAssets));
    return structuredClone(starterAssets);
  }
  try { return JSON.parse(saved); } catch { return structuredClone(starterAssets); }
}

export function saveAssets(assets){
  localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
}

export function nextAssetId(assets){
  const max = assets.reduce((value, asset) => Math.max(value, Number(String(asset.id).replace(/\D/g,'')) || 1000), 1000);
  return `AST-${max + 1}`;
}
