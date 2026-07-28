import {getAssets,saveAssets,nextAssetId} from '../core/store.js';
import {money,date,badge,toast,escapeHtml} from '../core/ui.js';

let searchText='';
let categoryFilter='All';
let statusFilter='All';

const statuses=['Available','Part Allocated','Allocated','Service Due','Out of Service'];

export function renderAssets(){
  const assets=getAssets();
  const categories=['All',...new Set(assets.map(a=>a.category).filter(Boolean))];
  const filtered=assets.filter(asset=>{
    const haystack=`${asset.id} ${asset.name} ${asset.manufacturer} ${asset.model} ${asset.serial} ${asset.location}`.toLowerCase();
    return haystack.includes(searchText.toLowerCase())
      && (categoryFilter==='All'||asset.category===categoryFilter)
      && (statusFilter==='All'||asset.status===statusFilter);
  });

  const totalUnits=assets.reduce((sum,a)=>sum+Number(a.quantity||0),0);
  const availableUnits=assets.reduce((sum,a)=>sum+Number(a.available||0),0);
  const serviceDue=assets.filter(a=>a.status==='Service Due' || (a.serviceDue && new Date(a.serviceDue) <= new Date(Date.now()+45*86400000))).length;
  const hireValue=assets.reduce((sum,a)=>sum+(Number(a.dailyRate||0)*Number(a.quantity||0)),0);

  queueMicrotask(bindAssetEvents);

  return `
    <section class="page-heading">
      <div><p class="eyebrow">Assets module</p><h1>Assets</h1><p>Manage equipment records, quantities, availability and servicing.</p></div>
      <div class="actions"><button class="button primary" id="new-asset">+ New asset</button></div>
    </section>

    <section class="metric-grid">
      <article class="metric"><div class="metric-label">Asset records</div><div class="metric-value">${assets.length}</div><div class="metric-note">Unique equipment lines</div></article>
      <article class="metric"><div class="metric-label">Total units</div><div class="metric-value">${totalUnits}</div><div class="metric-note">${availableUnits} currently available</div></article>
      <article class="metric"><div class="metric-label">Service attention</div><div class="metric-value">${serviceDue}</div><div class="metric-note">Due within 45 days or flagged</div></article>
      <article class="metric"><div class="metric-label">Daily hire value</div><div class="metric-value">${money(hireValue)}</div><div class="metric-note">At listed daily rates</div></article>
    </section>

    <div class="toolbar">
      <input id="asset-search" type="search" placeholder="Search assets, serials or locations…" value="${escapeHtml(searchText)}">
      <select id="asset-category-filter">${categories.map(c=>`<option ${c===categoryFilter?'selected':''}>${c}</option>`).join('')}</select>
      <select id="asset-status-filter">${['All',...statuses].map(s=>`<option ${s===statusFilter?'selected':''}>${s}</option>`).join('')}</select>
    </div>

    <section class="panel">
      ${filtered.length ? `<div class="table-wrap"><table>
        <thead><tr><th>Asset</th><th>Category</th><th>Quantity</th><th>Available</th><th>Location</th><th>Status</th><th>Daily rate</th><th>Service due</th><th></th></tr></thead>
        <tbody>${filtered.map(asset=>`<tr>
          <td><strong>${escapeHtml(asset.name)}</strong><br><small class="muted">${asset.id} · ${escapeHtml(asset.serial||'No serial')}</small></td>
          <td>${escapeHtml(asset.category)}</td>
          <td>${Number(asset.quantity||0)}</td>
          <td>${Number(asset.available||0)}</td>
          <td>${escapeHtml(asset.location||'—')}</td>
          <td>${assetStatusBadge(asset.status)}</td>
          <td>${money(asset.dailyRate)}</td>
          <td>${date(asset.serviceDue)}</td>
          <td><button class="button small edit-asset" data-id="${asset.id}">Edit</button></td>
        </tr>`).join('')}</tbody>
      </table></div>` : `<div class="empty-state"><h3>No assets found</h3><p>Adjust your filters or create a new asset.</p></div>`}
    </section>`;
}

function assetStatusBadge(status){
  const map={
    'Available':'confirmed',
    'Part Allocated':'quoted',
    'Allocated':'enquiry',
    'Service Due':'cancelled',
    'Out of Service':'cancelled'
  };
  return `<span class="badge ${map[status]||'completed'}">${status}</span>`;
}

function bindAssetEvents(){
  document.querySelector('#new-asset')?.addEventListener('click',()=>openAssetModal());
  document.querySelectorAll('.edit-asset').forEach(btn=>btn.addEventListener('click',()=>openAssetModal(btn.dataset.id)));
  document.querySelector('#asset-search')?.addEventListener('input',e=>{searchText=e.target.value; window.dispatchEvent(new Event('th:rerender'));});
  document.querySelector('#asset-category-filter')?.addEventListener('change',e=>{categoryFilter=e.target.value; window.dispatchEvent(new Event('th:rerender'));});
  document.querySelector('#asset-status-filter')?.addEventListener('change',e=>{statusFilter=e.target.value; window.dispatchEvent(new Event('th:rerender'));});
}

function openAssetModal(id=null){
  const assets=getAssets();
  const existing=assets.find(a=>a.id===id);
  const asset=existing||{
    id:nextAssetId(assets),name:'',category:'Lighting',manufacturer:'',model:'',serial:'',
    quantity:1,available:1,status:'Available',location:'',purchaseDate:'',serviceDue:'',
    dailyRate:'',notes:''
  };

  const wrap=document.createElement('div');
  wrap.className='modal-backdrop';
  wrap.innerHTML=`<form class="modal" id="asset-form">
    <div class="modal-head">
      <div><p class="eyebrow">${existing?'Edit asset':'New asset'}</p><h2 style="margin:0">${asset.id}</h2></div>
      <button type="button" class="button small" data-close>Close</button>
    </div>
    <div class="modal-body"><div class="form-grid">
      <label class="full">Asset name<input name="name" value="${escapeHtml(asset.name)}" required></label>
      <label>Category<select name="category">${['Lighting','Audio','Video','Control','Rigging','LED / Pixel','Power','Staging','Other'].map(c=>`<option ${c===asset.category?'selected':''}>${c}</option>`).join('')}</select></label>
      <label>Status<select name="status">${statuses.map(s=>`<option ${s===asset.status?'selected':''}>${s}</option>`).join('')}</select></label>
      <label>Manufacturer<input name="manufacturer" value="${escapeHtml(asset.manufacturer)}"></label>
      <label>Model<input name="model" value="${escapeHtml(asset.model)}"></label>
      <label>Serial/reference<input name="serial" value="${escapeHtml(asset.serial)}"></label>
      <label>Storage location<input name="location" value="${escapeHtml(asset.location)}"></label>
      <label>Quantity<input id="asset-quantity" name="quantity" type="number" min="0" step="1" value="${asset.quantity}" required></label>
      <label>Available quantity<input id="asset-available" name="available" type="number" min="0" step="1" value="${asset.available}" required></label>
      <label>Daily hire rate (£)<input name="dailyRate" type="number" min="0" step="0.01" value="${asset.dailyRate}"></label>
      <label>Purchase date<input name="purchaseDate" type="date" value="${asset.purchaseDate||''}"></label>
      <label>Service due<input name="serviceDue" type="date" value="${asset.serviceDue||''}"></label>
      <label class="full">Notes<textarea name="notes">${escapeHtml(asset.notes)}</textarea></label>
    </div></div>
    <div class="modal-foot">
      ${existing?'<button type="button" class="button danger" id="delete-asset">Delete</button>':''}
      <button type="button" class="button" data-close>Cancel</button>
      <button class="button primary" type="submit">Save asset</button>
    </div>
  </form>`;

  document.body.appendChild(wrap);
  wrap.querySelectorAll('[data-close]').forEach(btn=>btn.onclick=()=>wrap.remove());
  wrap.addEventListener('click',event=>{if(event.target===wrap)wrap.remove()});

  wrap.querySelector('#asset-form').onsubmit=event=>{
    event.preventDefault();
    const data=Object.fromEntries(new FormData(event.currentTarget));
    const quantity=Number(data.quantity||0);
    const available=Math.min(Number(data.available||0),quantity);
    const updated={...asset,...data,quantity,available,dailyRate:Number(data.dailyRate||0)};
    const next=existing?assets.map(a=>a.id===id?updated:a):[updated,...assets];
    saveAssets(next);
    wrap.remove();
    toast(existing?'Asset updated':'Asset created');
    window.dispatchEvent(new Event('th:rerender'));
  };

  wrap.querySelector('#delete-asset')?.addEventListener('click',()=>{
    if(confirm(`Delete ${asset.id} – ${asset.name}?`)){
      saveAssets(assets.filter(a=>a.id!==id));
      wrap.remove();
      toast('Asset deleted');
      window.dispatchEvent(new Event('th:rerender'));
    }
  });
}
