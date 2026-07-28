import {renderDashboard} from './modules/dashboard.js';
import {renderJobs} from './modules/jobs.js';
import {renderAssets} from './modules/assets.js';
import {renderPlaceholder} from './modules/placeholders.js';

if(!localStorage.getItem('th_command_session')) location.replace('/login.html');

const routes={
  dashboard:renderDashboard,
  jobs:renderJobs,
  assets:renderAssets,
  warehouse:()=>renderPlaceholder('Warehouse','Prep lists, scanning, dispatch and returns.'),
  clients:()=>renderPlaceholder('CRM','Clients, contacts, venues and communication history.'),
  crew:()=>renderPlaceholder('Crew','Staff, freelancers, skills, availability and assignments.'),
  finance:()=>renderPlaceholder('Finance','Quotes, invoices, purchase orders and reporting.'),
  settings:()=>renderPlaceholder('Settings','Users, permissions, company details and system preferences.')
};

const nav=[
  ['dashboard','⌂','Dashboard'],['jobs','▣','Jobs'],['assets','◈','Assets'],['warehouse','▤','Warehouse'],
  ['clients','◎','CRM'],['crew','♙','Crew'],['finance','£','Finance'],['settings','⚙','Settings']
];

document.querySelector('#app').innerHTML=`
<div class="app-shell">
  <aside class="sidebar" id="sidebar">
    <div class="brand"><div class="brand-mark">TH</div><div class="brand-copy"><strong>TH Command</strong><span>Event Production ERP</span></div></div>
    <nav class="nav">${nav.map(([key,icon,label])=>`<a class="nav-link" data-route="${key}" href="#${key}"><span class="nav-icon">${icon}</span>${label}</a>`).join('')}</nav>
    <div class="sidebar-bottom"><div class="user-tile"><div class="avatar">TH</div><div><strong>Tyler</strong><small class="muted" style="display:block">Administrator</small></div></div><button class="button" id="logout" style="width:100%;margin-top:8px">Sign out</button></div>
  </aside>
  <section class="main-shell">
    <header class="topbar"><button class="button small mobile-menu" id="menu-button">Menu</button><div class="topbar-title" id="route-title">Dashboard</div><div class="topbar-spacer"></div><input class="search-box" placeholder="Search TH Command…"><a class="button small" href="/scan">Scan QR</a><span class="badge confirmed">Online</span></header>
    <main class="content" id="view"></main>
  </section>
</div>`;

function currentRoute(){return (location.hash.slice(1).split('?')[0]||'dashboard');}
function render(){
  const route=currentRoute();
  const view=document.querySelector('#view');
  const renderer=routes[route]||(()=>renderPlaceholder('Page not found','The requested module does not exist.'));
  view.innerHTML=renderer();
  document.querySelectorAll('[data-route]').forEach(link=>link.classList.toggle('active',link.dataset.route===route));
  const item=nav.find(n=>n[0]===route);
  document.querySelector('#route-title').textContent=item?.[2]||'TH Command';
  document.querySelector('#sidebar').classList.remove('open');
}
window.addEventListener('hashchange',render);
window.addEventListener('th:rerender',render);
document.querySelector('#menu-button').onclick=()=>document.querySelector('#sidebar').classList.toggle('open');
document.querySelector('#logout').onclick=()=>{localStorage.removeItem('th_command_session');location.replace('/login.html')};
render();
