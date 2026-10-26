(function(){
  var d=document, root=d.documentElement;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var top=d.getElementById('top');
  function setTop(){ root.style.setProperty('--toph', top.offsetHeight+'px'); }
  setTop(); window.addEventListener('resize', setTop);
  if(window.ResizeObserver) new ResizeObserver(setTop).observe(top);

  var burger=d.querySelector('.burger'), nav=d.getElementById('nav');
  function menu(open){
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open?'Закрыть меню':'Меню');
    nav.classList.toggle('open', open);
  }
  burger.addEventListener('click', function(){ menu(burger.getAttribute('aria-expanded')!=='true'); });
  nav.addEventListener('click', function(e){ if(e.target.closest('a')) menu(false); });
  d.addEventListener('keydown', function(e){ if(e.key==='Escape' && nav.classList.contains('open')){ menu(false); burger.focus(); } });
  window.addEventListener('resize', function(){ if(innerWidth>1060) menu(false); });

  var rv=[].slice.call(d.querySelectorAll('.rv'));
  if(reduce || !('IntersectionObserver' in window)) rv.forEach(function(el){ el.classList.add('in'); });
  else {
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, {rootMargin:'0px 0px -6% 0px', threshold:0.05});
    rv.forEach(function(el){ io.observe(el); });
  }

  [].forEach.call(d.querySelectorAll('[data-reel]'), function(reel){
    var tr=reel.querySelector('.reel__track'), sl=tr.children, n=sl.length;
    var prev=reel.querySelector('[data-dir="-1"]'), next=reel.querySelector('[data-dir="1"]'), cnt=reel.querySelector('.reel__count');
    function step(){ return n>1 ? sl[1].offsetLeft-sl[0].offsetLeft : tr.clientWidth; }
    function cur(){ return Math.round(tr.scrollLeft/step()); }
    function upd(){
      var i=Math.min(n-1,cur()), vis=Math.max(1,Math.round(tr.clientWidth/step())), last=Math.min(n,i+vis);
      cnt.textContent=(vis>1?(i+1)+'–'+last:(i+1))+' / '+n;
      prev.disabled=tr.scrollLeft<=2; next.disabled=tr.scrollLeft>=tr.scrollWidth-tr.clientWidth-2;
    }
    function go(k){ tr.scrollTo({left:Math.max(0,cur()+k)*step(), behavior:reduce?'auto':'smooth'}); }
    prev.addEventListener('click', function(){ go(-1); });
    next.addEventListener('click', function(){ go(1); });
    tr.addEventListener('keydown', function(e){ if(e.key==='ArrowRight'){e.preventDefault();go(1);} if(e.key==='ArrowLeft'){e.preventDefault();go(-1);} });
    var t; tr.addEventListener('scroll', function(){ clearTimeout(t); t=setTimeout(upd,60); }, {passive:true});
    window.addEventListener('resize', upd); upd();
  });

  var mo=d.querySelector('.map__open');
  if(mo) mo.addEventListener('click', function(e){
    e.preventDefault();
    var f=d.createElement('iframe'); f.src=mo.getAttribute('data-src'); f.title='Карта: Новосибирск, Советская улица, 64'; f.setAttribute('allowfullscreen','');
    mo.parentNode.replaceChild(f, mo);
  });
})();
