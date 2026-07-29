const bus=new EventTarget();
export const Events={
 on(n,cb){bus.addEventListener(n,cb);},
 off(n,cb){bus.removeEventListener(n,cb);},
 emit(n,detail={}){bus.dispatchEvent(new CustomEvent(n,{detail}));}
};