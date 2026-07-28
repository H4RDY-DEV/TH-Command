function normaliseAsset(asset = {}){
  return {
    id: String(asset.id || ''),
    name: String(asset.name || ''),
    category: String(asset.category || ''),
    manufacturer: String(asset.manufacturer || ''),
    model: String(asset.model || ''),
    serial: String(asset.serial || ''),
    location: String(asset.location || ''),
    status: String(asset.status || ''),
    serviceDue: String(asset.serviceDue || ''),
    quantity: Number(asset.quantity || 0),
    available: Number(asset.available || 0),
    dailyRate: Number(asset.dailyRate || 0),
    notes: String(asset.notes || '')
  };
}

function toBase64Url(value){
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}

function fromBase64Url(value){
  const clean = String(value || '').trim();
  const padded = clean.replace(/-/g,'+').replace(/_/g,'/') + '='.repeat((4 - clean.length % 4) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function assetQrPayload(asset){
  const json = JSON.stringify(normaliseAsset(asset));
  return `THCMD-ASSET-V1:${toBase64Url(json)}`;
}

export function assetFromQrPayload(text){
  try{
    const raw = String(text || '').trim();
    const prefix = 'THCMD-ASSET-V1:';
    if(!raw.toUpperCase().startsWith(prefix)) return null;
    const encoded = raw.slice(prefix.length);
    const asset = JSON.parse(fromBase64Url(encoded));
    return asset?.id ? normaliseAsset(asset) : null;
  }catch{
    return null;
  }
}

export function assetFromCompactPayload(text){
  const raw = String(text ?? '').trim();
  const parts = raw.split('|');
  if(parts.length < 5) return null;
  if(parts[0].toUpperCase() !== 'THCMD' || parts[1].toUpperCase() !== 'ASSET') return null;
  return normaliseAsset({
    id: parts[3],
    name: parts[4],
    category: parts[5],
    manufacturer: parts[6],
    model: parts[7],
    serial: parts[8],
    location: parts[9],
    status: parts[10],
    serviceDue: parts[11],
    quantity: parts[12],
    available: parts[13],
    dailyRate: parts[14],
    notes: parts.slice(15).join('|')
  });
}

export function assetFromUrl(url){
  try{
    const parsed = url instanceof URL ? url : new URL(String(url), location.origin);
    const params = parsed.searchParams;
    const id = params.get('id') || params.get('assetId') || params.get('asset');
    if(!id) return null;
    return normaliseAsset({
      id,
      name: params.get('name') || params.get('n') || 'Unnamed asset',
      category: params.get('category') || params.get('c') || '',
      manufacturer: params.get('manufacturer') || params.get('make') || '',
      model: params.get('model') || '',
      serial: params.get('serial') || params.get('s') || '',
      location: params.get('location') || params.get('l') || '',
      status: params.get('status') || '',
      serviceDue: params.get('serviceDue') || params.get('service') || '',
      quantity: params.get('quantity') || 0,
      available: params.get('available') || 0,
      dailyRate: params.get('dailyRate') || 0,
      notes: params.get('notes') || ''
    });
  }catch{
    return null;
  }
}

export function decodeAssetPayload(encoded){
  try{
    const asset = JSON.parse(fromBase64Url(encoded));
    return asset?.id ? normaliseAsset(asset) : null;
  }catch{
    return null;
  }
}
