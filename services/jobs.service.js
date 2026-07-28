import { getJobs, saveJob } from '../assets/js/jobs-api.js';

export async function loadJobs(){
  return await getJobs();
}

export async function createJob(data){
  return await saveJob(data);
}
