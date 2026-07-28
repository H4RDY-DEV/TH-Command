function clean(value=''){
  return String(value ?? '')
    .replace(/\|/g, '/')
    .replace(/\r?\n/g, ' ')
    .trim();
}

export function assetQrPayload(asset){
  const fields = [
    'THCMD',
    'ASSET',
    '1',
    clean(asset.id),
    clean(asset.name),
    clean(asset.category),
    clean(asset.manufacturer),
    clean(asset.model),
    clean(asset.serial),
    clean(asset.location),
    clean(asset.status),
    clean(asset.serviceDue)
  ];
  return fields.join('|');
}

export function assetFromCompactPayload(text){
  const raw = String(text ?? '').trim();
  const parts = raw.split('|');

  if(parts.length < 5) return null;
  if(parts[0].toUpperCase() !== 'THCMD') return null;
  if(parts[1].toUpperCase() !== 'ASSET') return null;

  return {
    id: parts[3] || '',
    name: parts[4] || 'Unnamed asset',
    category: parts[5] || '',
    manufacturer: parts[6] || '',
    model: parts[7] || '',
    serial: parts[8] || '',
    location: parts[9] || '',
    status: parts[10] || '',
    serviceDue: parts[11] || ''
  };
}

export function assetFromUrl(url){
  try{
    const parsed = url instanceof URL ? url : new URL(String(url), location.origin);
    const params = parsed.searchParams;
    const id = params.get('id') || params.get('assetId') || params.get('asset');
    if(!id) return null;

    return {
      id,
      name: params.get('name') || params.get('n') || 'Unnamed asset',
      category: params.get('category') || params.get('c') || '',
      manufacturer: params.get('manufacturer') || params.get('make') || '',
      model: params.get('model') || '',
      serial: params.get('serial') || params.get('s') || '',
      location: params.get('location') || params.get('l') || '',
      status: params.get('status') || '',
      serviceDue: params.get('serviceDue') || params.get('service') || ''
    };
  }catch{
    return null;
  }
}

export function decodeAssetPayload(encoded){
  try{
    const cleanValue = String(encoded || '').trim();
    const padded = cleanValue.replace(/-/g,'+').replace(/_/g,'/') + '='.repeat((4 - cleanValue.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    return parsed?.id ? parsed : null;
  }catch{
    return null;
  }
}
