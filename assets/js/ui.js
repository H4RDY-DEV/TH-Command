
export function openModal(title,html){
 const m=document.getElementById('modal');
 document.getElementById('modalTitle').textContent=title;
 document.getElementById('modalContent').innerHTML=html;
 m.classList.remove('hidden');
}
window.closeModal=()=>document.getElementById('modal').classList.add('hidden');

export function toast(msg){
 const t=document.createElement('div');
 t.className='toast';
 t.textContent=msg;
 document.body.appendChild(t);
 setTimeout(()=>t.remove(),3000);
}
