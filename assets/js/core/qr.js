export function assetQrPayload(asset){
  const payload = {
    v: 1,
    type: 'asset',
    id: asset.id,
    name: asset.name,
    category: asset.category,
    manufacturer: asset.manufacturer || '',
    model: asset.model || '',
    serial: asset.serial || '',
    location: asset.location || '',
    status: asset.status || '',
    serviceDue: asset.serviceDue || ''
  };
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  const encoded = btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  return `${location.origin}/scan.html#asset=${encoded}`;
}

export function decodeAssetPayload(encoded){
  try{
    const padded = encoded.replace(/-/g,'+').replace(/_/g,'/') + '='.repeat((4 - encoded.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }catch{
    return null;
  }
}
