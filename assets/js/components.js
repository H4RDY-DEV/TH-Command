
export async function loadComponent(id,url){
 document.getElementById(id).innerHTML=await fetch(url).then(r=>r.text());
}
