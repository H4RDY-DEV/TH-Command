export async function request(endpoint,options={}){
 try{
   const r=await fetch(endpoint,options);
   if(!r.ok) throw new Error(r.statusText);
   return await r.json();
 }catch(err){
   console.error(err);
   return {error:true,message:err.message};
 }
}
