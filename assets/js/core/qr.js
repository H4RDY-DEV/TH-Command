export function assetQrPayload(asset){
  const url = new URL('/scan', location.origin);
  url.searchParams.set('id', asset.id || '');
  url.searchParams.set('name', asset.name || '');
  url.searchParams.set('category', asset.category || '');
  url.searchParams.set('serial', asset.serial || '');
  url.searchParams.set('location', asset.location || '');
  url.searchParams.set('status', asset.status || '');
  url.searchParams.set('serviceDue', asset.serviceDue || '');
  return url.toString();
}

export function assetFromUrl(url = new URL(location.href)){
  const id = url.searchParams.get('id');
  if(!id) return null;
  return {
    id,
    name: url.searchParams.get('name') || 'Unnamed asset',
    category: url.searchParams.get('category') || '',
    manufacturer: url.searchParams.get('manufacturer') || '',
    model: url.searchParams.get('model') || '',
    serial: url.searchParams.get('serial') || '',
    location: url.searchParams.get('location') || '',
    status: url.searchParams.get('status') || '',
    serviceDue: url.searchParams.get('serviceDue') || ''
  };
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
