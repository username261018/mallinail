(function(){
  var d=document, root=d.documentElement;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(reduce || !fine) return;
  var raf=0, px=0, py=0;
  d.addEventListener('pointermove', function(e){
    px=e.clientX; py=e.clientY;
    if(!raf) raf=requestAnimationFrame(function(){ raf=0; root.style.setProperty('--sx', px+'px'); root.style.setProperty('--sy', py+'px'); });
  }, {passive:true});
  var t=d.getElementById('tilt'); if(!t) return;
  var box=t.parentNode;
  box.addEventListener('pointermove', function(e){
    var r=box.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    t.style.setProperty('--ry', (x*14).toFixed(2)+'deg'); t.style.setProperty('--rx', (-y*14).toFixed(2)+'deg');
  });
  box.addEventListener('pointerleave', function(){ t.style.setProperty('--ry','0deg'); t.style.setProperty('--rx','0deg'); t.classList.remove('hold'); });
  box.addEventListener('pointerdown', function(){ t.classList.add('hold'); });
  d.addEventListener('pointerup', function(){ t.classList.remove('hold'); });
})();
