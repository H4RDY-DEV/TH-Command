function pick(asset = {}, ...keys){
  for(const key of keys){
    const value = asset?.[key];
    if(value !== undefined && value !== null && value !== '') return value;
  }
  return '';
}

export function normaliseAsset(asset = {}){
  return {
    id: String(pick(asset,'id','assetId','asset_id')),
    name: String(pick(asset,'name','assetName','title')),
    category: String(pick(asset,'category','assetCategory','type')),
    manufacturer: String(pick(asset,'manufacturer','make','brand')),
    model: String(pick(asset,'model','modelName')),
    serial: String(pick(asset,'serial','serialNumber','reference')),
    location: String(pick(asset,'location','storageLocation','warehouseLocation')),
    status: String(pick(asset,'status','assetStatus')),
    serviceDue: String(pick(asset,'serviceDue','service_due','nextService')),
    quantity: Number(pick(asset,'quantity','qty') || 0),
    available: Number(pick(asset,'available','availableQuantity','available_qty') || 0),
    dailyRate: Number(pick(asset,'dailyRate','daily_rate','hireRate') || 0),
    notes: String(pick(asset,'notes','description'))
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
  const a = normaliseAsset(asset);
  // Short property names keep the QR less dense and easier for phones to scan.
  const compact = {
    i:a.id,n:a.name,c:a.category,b:a.manufacturer,m:a.model,s:a.serial,
    l:a.location,t:a.status,d:a.serviceDue,q:a.quantity,a:a.available,
    r:a.dailyRate,x:a.notes
  };
  return `THA2:${toBase64Url(JSON.stringify(compact))}`;
}

export function assetFromQrPayload(text){
  try{
    const raw = String(text || '').trim();
    if(raw.toUpperCase().startsWith('THA2:')){
      const data = JSON.parse(fromBase64Url(raw.slice(5)));
      return normaliseAsset({
        id:data.i,name:data.n,category:data.c,manufacturer:data.b,model:data.m,
        serial:data.s,location:data.l,status:data.t,serviceDue:data.d,
        quantity:data.q,available:data.a,dailyRate:data.r,notes:data.x
      });
    }

    const oldPrefix = 'THCMD-ASSET-V1:';
    if(raw.toUpperCase().startsWith(oldPrefix)){
      return normaliseAsset(JSON.parse(fromBase64Url(raw.slice(oldPrefix.length))));
    }
    return null;
  }catch{
    return null;
  }
}

export function assetFromCompactPayload(text){
  const parts = String(text ?? '').trim().split('|');
  if(parts.length < 5 || parts[0].toUpperCase() !== 'THCMD' || parts[1].toUpperCase() !== 'ASSET') return null;
  return normaliseAsset({
    id:parts[3],name:parts[4],category:parts[5],manufacturer:parts[6],
    model:parts[7],serial:parts[8],location:parts[9],status:parts[10],
    serviceDue:parts[11],quantity:parts[12],available:parts[13],
    dailyRate:parts[14],notes:parts.slice(15).join('|')
  });
}

export function assetFromUrl(url){
  try{
    const parsed = url instanceof URL ? url : new URL(String(url), location.origin);
    const p = parsed.searchParams;
    const id = p.get('id') || p.get('assetId') || p.get('asset');
    if(!id) return null;
    return normaliseAsset({
      id,name:p.get('name') || p.get('n'),category:p.get('category') || p.get('c'),
      manufacturer:p.get('manufacturer') || p.get('make'),model:p.get('model'),
      serial:p.get('serial') || p.get('s'),location:p.get('location') || p.get('l'),
      status:p.get('status'),serviceDue:p.get('serviceDue') || p.get('service'),
      quantity:p.get('quantity'),available:p.get('available'),
      dailyRate:p.get('dailyRate'),notes:p.get('notes')
    });
  }catch{
    return null;
  }
}

export function decodeAssetPayload(encoded){
  try{
    return normaliseAsset(JSON.parse(fromBase64Url(encoded)));
  }catch{
    return null;
  }
}
