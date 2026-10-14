MG20.applyEffects=function(t,e){(e||[]).forEach(x=>{let v=Number(t[x.type]||0);t[x.type]=x.operation==='set'?x.value:x.operation==='multiply'?v*x.value:v+x.value});return t};
