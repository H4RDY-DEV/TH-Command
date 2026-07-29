import {Storage} from "../core/storage.js";
import {Events} from "../core/events.js";
const KEY="th_command_history_v9";
export const HistoryService={
 all(){return Storage.load(KEY,[]);},
 log(type,data={}){
  const h=this.all();
  h.unshift({id:crypto.randomUUID(),type,data,created:new Date().toISOString()});
  Storage.save(KEY,h);
  Events.emit("history:changed",{type});
 },
 recent(n=50){return this.all().slice(0,n);}
};