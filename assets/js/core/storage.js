export const Storage={
 load(k,f=[]){try{return JSON.parse(localStorage.getItem(k))??f;}catch{return f;}},
 save(k,v){localStorage.setItem(k,JSON.stringify(v));}
};