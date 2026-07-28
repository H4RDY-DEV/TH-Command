const available=[
{id:'L001',name:'Robe MegaPointe'},
{id:'A001',name:'d&b C4 Sub'},
{id:'A002',name:'LS10 Top'}
];
const allocated=[];
const a=document.getElementById('assetList');
const b=document.getElementById('allocatedList');

function render(){
 if(a) a.innerHTML=available.map(x=>`<li>${x.name} <button onclick="allocate('${x.id}')">Assign</button></li>`).join('');
 if(b) b.innerHTML=allocated.map(x=>`<li>${x.name}</li>`).join('');
}

window.allocate=function(id){
 const i=available.findIndex(x=>x.id===id);
 if(i>-1){
   allocated.push(available[i]);
   available.splice(i,1);
   render();
 }
}
render();
