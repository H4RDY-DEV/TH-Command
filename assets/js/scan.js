import {decodeAssetPayload,assetFromUrl} from './core/qr.js';

const scanHome = document.querySelector('#scan-home');
const resultPanel = document.querySelector('#asset-result');
const resultBody = document.querySelector('#asset-result-body');
const statusEl = document.querySelector('#scan-status');
let scanner = null;
let running = false;

function escapeHtml(value=''){
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}

function showAsset(asset){
  scanHome.classList.add('hidden');
  resultPanel.classList.remove('hidden');
  resultBody.innerHTML = `
    <div class="asset-mobile-card">
      <p class="eyebrow">${escapeHtml(asset.id || 'Asset')}</p>
      <h2>${escapeHtml(asset.name || 'Unnamed asset')}</h2>
      <dl class="asset-details">
        <div><dt>Category</dt><dd>${escapeHtml(asset.category || '—')}</dd></div>
        <div><dt>Manufacturer</dt><dd>${escapeHtml(asset.manufacturer || '—')}</dd></div>
        <div><dt>Model</dt><dd>${escapeHtml(asset.model || '—')}</dd></div>
        <div><dt>Serial / reference</dt><dd>${escapeHtml(asset.serial || '—')}</dd></div>
        <div><dt>Location</dt><dd>${escapeHtml(asset.location || '—')}</dd></div>
        <div><dt>Status</dt><dd>${escapeHtml(asset.status || '—')}</dd></div>
        <div><dt>Service due</dt><dd>${escapeHtml(asset.serviceDue || '—')}</dd></div>
      </dl>
      <p class="scanner-note">Read-only QR snapshot. Database syncing will be added when TH Command is connected to Supabase.</p>
    </div>`;
}

function parseQrText(text){
  try{
    const url = new URL(text);
    const queryAsset = assetFromUrl(url);
    if(queryAsset) return queryAsset;

    const hash = new URLSearchParams(url.hash.replace(/^#/,''));
    const encoded = hash.get('asset');
    if(encoded) return decodeAssetPayload(encoded);
  }catch{}
  if(text.startsWith('THCMD:ASSET:')){
    return {id:text.split(':').pop(),name:'TH Command asset'};
  }
  return null;
}

async function handleScan(text){
  const asset = parseQrText(text);
  if(!asset){
    statusEl.textContent = 'This is not a recognised TH Command asset code.';
    return;
  }
  if(scanner && running){
    try{ await scanner.stop(); }catch{}
    running = false;
  }
  showAsset(asset);
}

async function startScanner(){
  if(!window.Html5Qrcode){
    statusEl.textContent = 'Scanner library failed to load. Check your internet connection.';
    return;
  }
  if(running) return;
  statusEl.textContent = 'Requesting camera access…';
  scanner = scanner || new Html5Qrcode('reader');
  try{
    await scanner.start(
      {facingMode:'environment'},
      {fps:10, qrbox:{width:250,height:250}},
      handleScan,
      () => {}
    );
    running = true;
    statusEl.textContent = 'Camera active. Point it at an asset QR code.';
  }catch(error){
    statusEl.textContent = `Unable to start camera: ${error}`;
  }
}

document.querySelector('#start-scan').addEventListener('click', startScanner);
document.querySelector('#scan-again').addEventListener('click', async ()=>{
  resultPanel.classList.add('hidden');
  scanHome.classList.remove('hidden');
  await startScanner();
});

const queryAsset = assetFromUrl(new URL(location.href));
if(queryAsset){
  showAsset(queryAsset);
}else{
  const hashParams = new URLSearchParams(location.hash.replace(/^#/,''));
  const encoded = hashParams.get('asset');
  if(encoded){
    const asset = decodeAssetPayload(encoded);
    if(asset) showAsset(asset);
  }
}
