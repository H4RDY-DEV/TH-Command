import {Storage} from "../core/storage.js";
import {Events} from "../core/events.js";
import {Job} from "../models/Job.js";
import {HistoryService} from "./history.js";
const KEY="th_command_jobs_v9";
export const JobService={
 all(){return Storage.load(KEY,[]).map(j=>new Job(j));},
 save(job){
  const jobs=this.all();
  const i=jobs.findIndex(x=>x.id===job.id);
  if(i>=0) jobs[i]=new Job(job); else jobs.push(new Job(job));
  Storage.save(KEY,jobs);
  HistoryService.log("Job Saved",{jobId:job.id,name:job.name});
  Events.emit("jobs:changed",{count:jobs.length});
 },
 remove(id){
  const jobs=this.all().filter(j=>j.id!==id);
  Storage.save(KEY,jobs);
  HistoryService.log("Job Removed",{jobId:id});
  Events.emit("jobs:changed",{count:jobs.length});
 }
};