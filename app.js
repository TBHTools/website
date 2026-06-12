/* ===== TBH Tools — interactions ===== */
(function(){
  // nav scroll state
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  // mobile drawer
  const menuBtn = document.querySelector('.menu-btn');
  const drawer = document.querySelector('.drawer');
  const toggle = (open) => {
    drawer.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn && menuBtn.addEventListener('click', () => toggle(!drawer.classList.contains('open')));
  drawer && drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));

  // scroll reveal — works in real browsers; degrades to "all visible" if the
  // animation timeline is frozen (e.g. some preview/capture contexts)
  const root = document.documentElement;
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  const checkReveals = () => {
    const trigger = window.innerHeight * 0.92;
    for(let i = reveals.length - 1; i >= 0; i--){
      if(reveals[i].getBoundingClientRect().top < trigger){
        reveals[i].classList.add('in');
        reveals.splice(i, 1);
      }
    }
  };
  let rafFired = false;
  requestAnimationFrame(() => { rafFired = true; checkReveals(); });
  window.addEventListener('scroll', checkReveals, {passive:true});
  window.addEventListener('resize', checkReveals, {passive:true});
  // failsafe: if the timeline is frozen, transitions can't run — show everything
  setTimeout(() => {
    checkReveals();
    const probe = document.querySelector('.reveal.in');
    if(!rafFired || (probe && parseFloat(getComputedStyle(probe).opacity) < 0.05)){
      root.classList.remove('anim');
      root.classList.add('show-all');
    }
  }, 1000);

  // live event feed (echoes the app)
  const feed = document.getElementById('feed');
  if(feed){
    const events = [
      {c:'go', msg:'Entrando em <b>NRM 3-5</b>', tag:'farm'},
      {c:'ok', msg:'<b>NRM 2-6</b> Clear', tag:'+2.4k'},
      {c:'go', msg:'Craft auto <b>Poção+</b>', tag:'craft'},
      {c:'ok', msg:'Benchmark <b>NRM 3-6</b>', tag:'gold ↑'},
      {c:'go', msg:'Entrando em <b>NRM 2-6</b>', tag:'farm'},
      {c:'ok', msg:'<b>NRM 3-5</b> Clear', tag:'+3.1k'},
      {c:'go', msg:'Inventário esvaziado', tag:'auto'},
      {c:'ok', msg:'Build importada <b>Priest</b>', tag:'sync'},
    ];
    let i = 0;
    const pad = n => String(n).padStart(2,'0');
    const stamp = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
    const push = () => {
      const ev = events[i % events.length]; i++;
      const row = document.createElement('div');
      row.className = 'feed-row ' + ev.c;
      row.innerHTML = `<span class="t">${stamp()}</span><span class="msg">${ev.msg}</span><span class="tag">${ev.tag}</span>`;
      feed.prepend(row);
      while(feed.children.length > 4) feed.lastElementChild.remove();
    };
    push(); push(); push();
    setInterval(push, 2200);
  }

  // animated gold counter in float stat
  const gold = document.getElementById('goldVal');
  if(gold){
    let base = 414.5;
    setInterval(() => {
      base += Math.random()*2.3;
      gold.innerHTML = base.toFixed(1) + '<span>k</span>';
    }, 2200);
  }

  // demo video — click overlay to play with native controls
  const vid = document.getElementById('vid');
  const vframe = document.getElementById('demoVideo');
  if(vid && vframe){
    const overlay = vframe.querySelector('.overlay');
    overlay.addEventListener('click', () => {
      vframe.classList.add('playing');
      vid.setAttribute('controls','');
      const p = vid.play();
      if(p && p.catch) p.catch(()=>{});
    });
    vid.addEventListener('pause', () => { if(vid.currentTime === 0) vframe.classList.remove('playing'); });
  }

  // video placeholder -> nudge to discord
  document.querySelectorAll('[data-soon]').forEach(el => {
    el.addEventListener('click', () => {
      el.animate([{transform:'scale(1)'},{transform:'scale(.985)'},{transform:'scale(1)'}],{duration:260,easing:'ease'});
    });
  });
})();
