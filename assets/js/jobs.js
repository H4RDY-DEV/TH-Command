export function initJobs(){
const search=document.getElementById('jobSearch');
if(search){
 search.addEventListener('input',()=>console.log('Search:',search.value));
}
console.log('Jobs v9.0.8 loaded');
}
