(function(){
  var d=document;
  var rok=d.getElementById('rok'); if(rok) rok.textContent=new Date().getFullYear();

  // menu mobilne
  var burger=d.getElementById('burger'), nav=d.getElementById('nav');
  function zamknij(){nav.classList.remove('otw');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');}
  burger.addEventListener('click',function(){
    var o=nav.classList.toggle('otw');
    burger.setAttribute('aria-expanded',o?'true':'false');
    burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');
  });
  nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij);});
  d.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});

  // aktywna pozycja menu
  var linki=[].slice.call(nav.querySelectorAll('a'));
  var sekcje=linki.map(function(a){return d.querySelector(a.getAttribute('href'));});
  function akt(){
    var y=window.scrollY+window.innerHeight*0.35, idx=-1;
    sekcje.forEach(function(s,i){if(s&&s.offsetTop<=y)idx=i;});
    linki.forEach(function(a,i){a.classList.toggle('akt',i===idx);});
  }
  window.addEventListener('scroll',akt,{passive:true}); akt();

  // dolny pasek po przewinięciu za przycisk w hero
  var mob=d.getElementById('mob'), cta=d.getElementById('cta-hero');
  if('IntersectionObserver' in window && mob && cta){
    new IntersectionObserver(function(en){
      var poza=!en[0].isIntersecting && en[0].boundingClientRect.top<0;
      mob.classList.toggle('widac',poza);
      mob.setAttribute('aria-hidden',poza?'false':'true');
      mob.querySelectorAll('a').forEach(function(a){a.tabIndex=poza?0:-1;});
    }).observe(cta);
  }

  // tor usług: palec, mysz, strzałki, licznik
  var tor=d.getElementById('tor');
  if(tor){
    var karty=tor.children, licz=d.getElementById('licz');
    var krok=function(){return karty[0].getBoundingClientRect().width+parseFloat(getComputedStyle(tor).columnGap||20);};
    d.querySelectorAll('.strz').forEach(function(b){
      b.addEventListener('click',function(){tor.scrollBy({left:krok()*+b.dataset.kier,behavior:'smooth'});});
    });
    var strz=d.querySelectorAll('.strz');
    function stan(){
      var i=Math.round(tor.scrollLeft/krok());
      if(licz) licz.textContent=Math.min(karty.length,i+1);
      if(strz.length){strz[0].disabled=tor.scrollLeft<4;strz[1].disabled=tor.scrollLeft+tor.clientWidth>=tor.scrollWidth-4;}
    }
    tor.addEventListener('scroll',stan,{passive:true}); window.addEventListener('resize',stan); stan();
    var x0=0,s0=0,ciag=false,ruch=0;
    tor.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse')return;
      ciag=true;ruch=0;x0=e.clientX;s0=tor.scrollLeft;tor.classList.add('ciag');
    });
    window.addEventListener('pointermove',function(e){
      if(!ciag)return; var dx=e.clientX-x0; ruch=Math.max(ruch,Math.abs(dx)); tor.scrollLeft=s0-dx;
    });
    window.addEventListener('pointerup',function(){
      if(!ciag)return; ciag=false; tor.classList.remove('ciag');
      var i=Math.round(tor.scrollLeft/krok()); tor.scrollTo({left:i*krok(),behavior:'smooth'});
    });
    tor.addEventListener('click',function(e){if(ruch>6){e.preventDefault();e.stopPropagation();}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault();});
    tor.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'){tor.scrollBy({left:krok(),behavior:'smooth'});e.preventDefault();}
      if(e.key==='ArrowLeft'){tor.scrollBy({left:-krok(),behavior:'smooth'});e.preventDefault();}
    });
  }

  // formularz pokazowy
  var f=d.getElementById('form'), info=d.getElementById('form-info');
  if(f) f.addEventListener('submit',function(e){
    e.preventDefault();
    info.textContent='To formularz pokazowy. W gotowej stronie zapytanie trafi na projekty@generalnetworks.pl.';
    info.classList.add('ok');
  });
})();
