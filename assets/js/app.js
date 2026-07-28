
const app=document.getElementById('app');
const sidebar=document.getElementById('sidebar');
if(!localStorage.getItem('th_logged_in')) location.href='./login.html';
sidebar.innerHTML=`<h2>Navigation</h2>
<a href="#dashboard">Dashboard</a>
<a href="#jobs">Jobs</a>
<a href="#assets">Assets</a>
<a href="#warehouse">Warehouse</a>
<a href="#" id="logout">Logout</a>`;
document.getElementById('logout').onclick=e=>{e.preventDefault();localStorage.removeItem('th_logged_in');location.href='./login.html';};
const pages={
"#dashboard":"<h2>Dashboard</h2><div class='cards'><div class='card'>Jobs: 0</div><div class='card'>Assets: 0</div><div class='card'>Crew: 0</div></div>",
"#jobs":"<h2>Jobs</h2><p>Module coming soon.</p>",
"#assets":"<h2>Assets</h2><p>Module coming soon.</p>",
"#warehouse":"<h2>Warehouse</h2><p>Module coming soon.</p>"
};
function render(){app.innerHTML=pages[location.hash||"#dashboard"]||"<h2>404</h2>";}
window.addEventListener("hashchange",render);render();
