export class Job{
 constructor(d={}){
  this.id=d.id||crypto.randomUUID();
  this.jobNumber=d.jobNumber||"";
  this.name=d.name||"";
  this.customer=d.customer||"";
  this.venue=d.venue||"";
  this.status=d.status||"Quote";
  this.start=d.start||"";
  this.finish=d.finish||"";
  this.assets=d.assets||[];
  this.crew=d.crew||[];
  this.vehicles=d.vehicles||[];
  this.notes=d.notes||[];
  this.history=d.history||[];
  this.created=d.created||new Date().toISOString();
  this.modified=new Date().toISOString();
 }
}