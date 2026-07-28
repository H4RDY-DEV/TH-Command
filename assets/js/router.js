const routes={
 '#dashboard':'pages/dashboard/index.html',
 '#jobs':'pages/jobs/index.html',
 '#assets':'pages/assets/index.html',
 '#warehouse':'pages/warehouse/index.html'
};
export async function navigate(hash){
 const page=routes[hash]||routes['#dashboard'];
 const html=await fetch(page).then(r=>r.text());
 document.getElementById('app').innerHTML=html;
}
window.addEventListener('hashchange',()=>navigate(location.hash));
