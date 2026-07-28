export function money(value){
  return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(Number(value)||0);
}
export function date(value){
  if(!value) return '—';
  return new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(value+'T12:00:00'));
}
export function badge(status){
  return `<span class="badge ${String(status).toLowerCase()}">${status}</span>`;
}
export function toast(message){
  document.querySelector('.toast')?.remove();
  const el=document.createElement('div');
  el.className='toast'; el.textContent=message;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),2400);
}
export function escapeHtml(value=''){
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}
