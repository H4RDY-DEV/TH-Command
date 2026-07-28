import {assetFromQrPayload,assetFromCompactPayload,decodeAssetPayload,assetFromUrl} from './core/qr.js';

const scanHome = document.querySelector('#scan-home');
const resultPanel = document.querySelector('#asset-result');
const resultBody = document.querySelector('#asset-result-body');
const statusEl = document.querySelector('#scan-status');
let scanner = null;
let running = false;
let processing = false;

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
        <div><dt>Quantity</dt><dd>${Number(asset.quantity || 0)}</dd></div>
        <div><dt>Available</dt><dd>${Number(asset.available || 0)}</dd></div>
        <div><dt>Daily rate</dt><dd>£${Number(asset.dailyRate || 0).toFixed(2)}</dd></div>
        <div><dt>Service due</dt><dd>${escapeHtml(asset.serviceDue || '—')}</dd></div>
        <div><dt>Notes</dt><dd>${escapeHtml(asset.notes || '—')}</dd></div>
      </dl>
      <p class="scanner-note">Asset QR record loaded successfully.</p>
    </div>`;
}

function normalise(value){
  let text = String(value ?? '').trim();
  text = text.replace(/&amp;/gi, '&');

  // Some mobile QR libraries wrap the decoded text in quotes.
  if((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))){
    text = text.slice(1,-1);
  }

  return text.trim();
}

function parseQrText(rawText){
  const text = normalise(rawText);
  if(!text) return null;

  // v8.3.4 compact JSON format.
  const currentAsset = assetFromQrPayload(text);
  if(currentAsset) return currentAsset;

  // v8.3.3 pipe-delimited format.
  const compactAsset = assetFromCompactPayload(text);
  if(compactAsset) return compactAsset;

  // Previous URL-based format.
  const urlAsset = assetFromUrl(text);
  if(urlAsset) return urlAsset;

  // Previous encoded hash format.
  try{
    const url = new URL(text, location.origin);
    const hash = new URLSearchParams(url.hash.replace(/^#/,''));
    const encoded = hash.get('asset');
    if(encoded){
      const legacy = decodeAssetPayload(encoded);
      if(legacy) return legacy;
    }
  }catch{}

  // Raw JSON fallback.
  try{
    const json = JSON.parse(text);
    if(json?.id) return json;
  }catch{}

  return null;
}

async function handleScan(decodedText, decodedResult){
  if(processing) return;
  processing = true;

  // html5-qrcode normally supplies decodedText, but some mobile builds expose
  // the text on decodedResult instead.
  const candidates = [
    decodedText,
    decodedResult?.decodedText,
    decodedResult?.result?.text,
    decodedResult?.text
  ].filter(Boolean);

  let asset = null;
  let raw = '';
  for(const candidate of candidates){
    raw = normalise(candidate);
    asset = parseQrText(raw);
    if(asset) break;
  }

  if(!asset){
    statusEl.innerHTML = `QR detected, but it is not a TH Command asset code.<br><small>Decoded value: ${escapeHtml(raw || '[empty]')}</small>`;
    processing = false;
    return;
  }

  try{
    if(scanner && running){
      await scanner.stop();
      running = false;
    }
  }catch{}

  showAsset(asset);
  processing = false;
}

async function startScanner(){
  if(!window.Html5Qrcode){
    statusEl.textContent = 'Scanner library failed to load. Check your internet connection.';
    return;
  }
  if(running) return;

  processing = false;
  statusEl.textContent = 'Requesting camera access…';
  scanner = scanner || new Html5Qrcode('reader');

  try{
    await scanner.start(
      {facingMode:{exact:'environment'}},
      {
        fps:8,
        qrbox:(viewfinderWidth,viewfinderHeight)=>{
          const size=Math.floor(Math.min(viewfinderWidth,viewfinderHeight)*0.72);
          return {width:size,height:size};
        },
        disableFlip:false
      },
      handleScan,
      () => {}
    );
    running = true;
    statusEl.textContent = 'Camera active. Hold the QR code steady inside the box.';
  }catch(firstError){
    try{
      await scanner.start(
        {facingMode:'environment'},
        {fps:8,qrbox:{width:240,height:240},disableFlip:false},
        handleScan,
        () => {}
      );
      running = true;
      statusEl.textContent = 'Camera active. Hold the QR code steady inside the box.';
    }catch(secondError){
      statusEl.textContent = `Unable to start camera: ${secondError}`;
    }
  }
}

document.querySelector('#start-scan').addEventListener('click', startScanner);
document.querySelector('#scan-again').addEventListener('click', async ()=>{
  resultPanel.classList.add('hidden');
  scanHome.classList.remove('hidden');
  processing = false;
  await startScanner();
});

// Keep direct-link support for QR labels from previous releases.
const directAsset = assetFromUrl(location.href);
if(directAsset){
  showAsset(directAsset);
}else{
  const hashParams = new URLSearchParams(location.hash.replace(/^#/,''));
  const encoded = hashParams.get('asset');
  if(encoded){
    const legacyAsset = decodeAssetPayload(encoded);
    if(legacyAsset) showAsset(legacyAsset);
  }
}
