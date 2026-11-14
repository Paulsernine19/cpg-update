/* ============================ REFERENCE SHELF ============================
   Quick reference as an endless 3D shelf of books: one book per REF_BOOKS entry (js/content/changes-reference.js).
   The active book turns out to show its cover; selecting it opens a full-screen detail sheet listing its REF items.
   Books view or list view (S.refView). One rAF loop (paused when nothing moves) + Web Animations.
   Deep link to one book: #reference/<group>-<n>, e.g. #reference/trauma-3 (n is 1-based, in REF_BOOKS order). */
// Book colour per group: trauma red, newborn purple, cardiac blue, stroke green, others grey
const RS_COL={trauma:"#C0392B",newborn:"#7B4FB8",cardiac:"#2E75B6",stroke:"#5E9A3A",other:"#6B7280"};
// spine icons (white line icons, 24px grid); keys are REF_BOOKS[...].icon
const RS_ICON=(()=>{const P={
  spine:'<rect x="8" y="2.5" width="8" height="4.5" rx="1.5"/><rect x="8" y="9.75" width="8" height="4.5" rx="1.5"/><rect x="8" y="17" width="8" height="4.5" rx="1.5"/><path d="M4.5 4.75H8M16 4.75h3.5M4.5 12H8M16 12h3.5M4.5 19.25H8M16 19.25h3.5"/>',
  smr:'<path d="M2.5 12h19M5 12v3M19 12v3"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/><rect x="3.5" y="7" width="6" height="5" rx="1.5"/><path d="M11 9.5h8"/>',
  car:'<path d="M3 16v-3.5L5.2 7h13.6l2.2 5.5V16z"/><path d="M3.5 12.5h17"/><circle cx="7.5" cy="16.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/>',
  bypass:'<path d="M12 21.5v-6.5L5 8M12 15l7-7"/><path d="M5 12.5V8h4.5M19 12.5V8h-4.5"/>',
  syringe:'<path d="M18 2.5l3.5 3.5M19.75 4.25L16 8M14.5 4.5l5 5M17 7l-9.5 9.5-3 .5.5-3L14.5 4.5M10 10l2 2M7.5 12.5l2 2M4.5 19.5L2.5 21.5"/>',
  thermo:'<path d="M10 14.3V5a2 2 0 0 1 4 0v9.3a4.2 4.2 0 1 1-4 0z"/><path d="M12 10v7.5"/>',
  newborn:'<circle cx="12" cy="13" r="7.5"/><path d="M12 5.5c0-1.5 1.2-2.5 2.5-2.5"/><circle cx="9.3" cy="12" r=".6" fill="currentColor"/><circle cx="14.7" cy="12" r=".6" fill="currentColor"/><path d="M9.8 15.5c1.3 1 3.1 1 4.4 0"/>',
  heart:'<path d="M12 20.5S3.5 15 3.5 9A4.5 4.5 0 0 1 12 6.6 4.5 4.5 0 0 1 20.5 9c0 6-8.5 11.5-8.5 11.5z"/><path d="M6 12h3l1.5-2.5 2 5 1.5-2.5h4"/>',
  pads:'<rect x="3" y="3" width="7.5" height="10" rx="2"/><rect x="13.5" y="11" width="7.5" height="10" rx="2"/><path d="M6.75 13v2.5a3 3 0 0 0 3 3h3.75M17.25 11V8.5a3 3 0 0 0-3-3H10.5"/>',
  bolt:'<path d="M13.5 2L5 13.5h6.5L10 22l9-12h-6.5z"/>',
  dsed:'<path d="M9.5 2.5L3.5 12h4.5l-1 7.5L13 10H8.5z"/><path d="M17.5 4.5l-5 8h3.5l-1 7 5.5-8.5H17z"/>',
  rosc:'<path d="M12 20.5S3.5 15 3.5 9A4.5 4.5 0 0 1 12 6.6 4.5 4.5 0 0 1 20.5 9c0 6-8.5 11.5-8.5 11.5z"/><path d="M12 16V10M9.2 12.6L12 9.8l2.8 2.8"/>',
  tree:'<rect x="8.5" y="2.5" width="7" height="5" rx="1.2"/><rect x="2.5" y="16.5" width="7" height="5" rx="1.2"/><rect x="14.5" y="16.5" width="7" height="5" rx="1.2"/><path d="M12 7.5V12M6 16.5V12h12v4.5"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2.2"/>',
  brain:'<path d="M12 5.5a3 3 0 0 0-5.6-1.2A3 3 0 0 0 4 8.5a3.2 3.2 0 0 0 .6 5.6A3 3 0 0 0 9 18.5a3 3 0 0 0 3 1.5z"/><path d="M12 5.5a3 3 0 0 1 5.6-1.2A3 3 0 0 1 20 8.5a3.2 3.2 0 0 1-.6 5.6A3 3 0 0 1 15 18.5a3 3 0 0 1-3 1.5z"/><path d="M14.5 8l-1.5 3h2.5l-2 3.5"/>',
  ecg:'<path d="M2 12h3l1.5-5 2 10 2-10 2 10 2-10 2 10 1.5-5H22"/>',
  pill:'<rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M9.7 8.7l4.6 6.6"/>'};
  const o={};for(const k in P)o[k]='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P[k]+"</svg>";return o})();
const RS_VIS={txachart:"Paediatric TXA dose chart",ways:"Newborn care pathways",timeline:"Shockable arrest timeline",tree:"Stroke destination decision tree"};
const rsPlain=h=>h.replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&[a-z]+;/g," ");
// short citation for the caption, e.g. "CPG 2.1–2.8"; full citations stay next to each point
const rsShortSrc=its=>{const n=[];its.forEach(x=>{for(const m of x.src.matchAll(/(?:CPG |–)(\d+)\.(\d+)/g))n.push([+m[1],+m[2]])});
  if(!n.length)return its[0]?its[0].src:"";n.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const f=n[0].join("."),l=n[n.length-1].join(".");return f===l?`CPG ${f}`:`CPG ${f}–${l}`};
const RS_ITEMS=[];
Object.keys(REF_BOOKS).forEach(m=>REF_BOOKS[m].forEach((b,k)=>{const mod=b.from||m,its=b.items.map(i=>REF[mod].items[i]).filter(Boolean);
  RS_ITEMS.push({m,mod,k,key:`${m}-${k+1}`,title:b.title,its,visual:b.visual,scope:its.some(x=>x.scope==="AP")?"AP":its.some(x=>x.scope==="CCP")?"CCP":"",
    src:[...new Set(its.map(x=>x.src))].join(" · "),srcShort:rsShortSrc(its),spine:b.spine||b.title,icon:b.icon,pend:its.some(x=>x.pend),img:b.img||(its[0]&&its[0].img)||"tx/avatar-thinking-half.webp",
    hay:rsPlain(`${b.title} ${its.map(x=>x.t+" "+x.src).join(" ")} ${BOOK_GROUPS[m]} ${MODS[mod]}`).toLowerCase()})}));
// one REF item as a list entry (detail sheet + list view)
const rsItemHTML=x=>`<li><p>${x.t}</p><div class="rsd-tags">${refScope(x.scope)}${x.pend?`<span class="badge pend">Details pending</span>`:""}<span class="rsd-src">${x.src}</span></div></li>`;
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches, EASE="cubic-bezier(.2,.8,.2,1)", SHEET_EASE="cubic-bezier(.76,0,.18,1)";
const rsScope=x=>x==="AP"?"AP &amp; CCP":x==="CCP"?"CCP only":"Scope to verify";
const rsSmooth=x=>x*x*(3-2*x), rsB=r=>Math.abs(r)<1?(r+Math.sin(Math.PI*r)/Math.PI)/2:Math.sign(r)*.5, rsMod=(a,n)=>((a%n)+n)%n;
const RS={N:RS_ITEMS.length,s:0,T:0,act:-1,hov:-1,mx:-1e4,my:-1e4,cx:-1e4,cy:-1e4,tiltX:0,tiltY:0,onCover:false,open:false,drag:null,raf:0,lt:0,idle:0,el:null,
  lastMod:null,inited:false,pendingIdx:null,openOnMount:false,wheelT:0,saveT:0,lift:null,G:{},query:"",q:[],mi:0,vis:false};

const rsSpine=(it,v)=>`<div class="rs-sp v${v%3}" style="--c:${RS_COL[it.m]}"><span class="rs-ic">${RS_ICON[it.icon]||""}</span><span class="rs-st${it.spine.length>16?" long":""}">${it.spine}</span><span class="rs-sl">CPG 2.6</span></div>`;
const rsCover=it=>`<div class="rs-cv" style="--c:${RS_COL[it.m]}"><span class="rs-ck">HMCAS · ${BOOK_GROUPS[it.m]}</span><b class="rs-ct${it.title.split(" ").some(w=>w.length>12)?" long":""}">${it.title}</b><div class="rs-ci"><img src="${it.img}" alt="" draggable="false"></div><div class="rs-cf"><span>${rsScope(it.scope)}</span><span class="rs-cb">v2.6</span></div></div>`;
const RS_ARROW=d=>`<svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor" stroke-width="1.2">${d<0?'<path d="M5 1 L1 5 L5 9 M1 5 H17"/>':'<path d="M13 1 L17 5 L13 9 M17 5 H1"/>'}</svg>`;

function rsKick(){if(!RS.raf&&RS.el&&RS.el.isConnected){RS.lt=0;RS.idle=0;RS.raf=requestAnimationFrame(rsFrame)}else RS.idle=0;}
const rsGo=T=>{RS.T=T;rsKick()};
function rsGeom(){const el=RS.el,W=el.clientWidth;
  let H=W<600?Math.min(W*.62,innerHeight*.42):Math.min(innerHeight*.5,W*.36,440);H=Math.max(180,Math.round(H));
  const g=RS.G;g.W=W;g.H=H;g.ws=H*142/840;g.d=H*474/900;g.gap=H*.03;
  el.style.setProperty("--H",H+"px");el.style.setProperty("--ws",g.ws+"px");el.style.setProperty("--d",g.d+"px");}
const rsInd=()=>{const on=RS.el&&RS.el.querySelector(".rs-tab.on");if(on){RS.ind.style.width=on.offsetWidth+"px";RS.ind.style.transform=`translateX(${on.offsetLeft}px)`}};

function rsMount(){
  const el=document.getElementById("rs");if(!el)return;RS.el=el;
  const N=RS.N;RS.lift=new Float32Array(3*N);
  el.innerHTML=`<div class="rs-top"><nav class="rs-tabs" aria-label="Modules"><i class="rs-ind"></i>${Object.keys(REF_BOOKS).map(k=>`<button class="rs-tab lbl" data-rsmod="${k}">${BOOK_GROUPS[k]}</button>`).join("")}</nav>
   <div class="rs-find" role="search"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="6" cy="6" r="4.6"/><path d="M9.4 9.4 L13 13"/></svg>
    <input type="search" class="rs-q" placeholder="Search, e.g. TXA, RACE, J/kg" aria-label="Search the quick reference" autocomplete="off" spellcheck="false">
    <span class="rs-hits lbl" aria-live="polite"></span><button class="rs-nx" data-rsfind="1" aria-label="Next match">${RS_ARROW(1)}</button></div></div>
  <section class="rs-shelf" aria-label="Reference shelf"><div class="rs-stage" aria-hidden="true">${Array.from({length:3*N},(_,v)=>{const it=RS_ITEMS[v%N];return `<div class="rs-tape" data-v="${v}">${rsSpine(it,v)}${rsCover(it)}</div>`}).join("")}</div></section>
  <div class="rs-capwrap"><button class="rs-arrow l" aria-label="Previous item">${RS_ARROW(-1)}</button>
   <div class="rs-cap" aria-live="polite"><div class="rs-m rs-t"></div><div class="rs-m rs-sub lbl"></div><div class="rs-m rs-yr"></div></div>
   <button class="rs-arrow r" aria-label="Next item">${RS_ARROW(1)}</button></div>`;
  RS.tapes=[...el.querySelectorAll(".rs-tape")].map(t=>({t,sp:t.firstChild,cv:t.lastChild}));
  RS.shelf=el.querySelector(".rs-shelf");RS.ind=el.querySelector(".rs-ind");
  rsGeom();
  // where to start: deep link / module button > remembered item (first visit this session) > module change > keep position
  let start=null;
  if(RS.pendingIdx!=null){start=RS.pendingIdx;RS.pendingIdx=null}
  else if(!RS.inited){const i=RS_ITEMS.findIndex(x=>x.key===S.refItem);start=i>=0?i:RS_ITEMS.findIndex(x=>x.m===refGrp)}
  else if(RS.lastMod!==refGrp)start=RS_ITEMS.findIndex(x=>x.m===refGrp);
  RS.inited=true;if(start!=null)RS.T=RS.s=N+Math.max(0,start);
  RS.act=-1;rsSetActive(rsMod(Math.round(RS.s),N),1,true);
  if(RS.query){el.querySelector(".rs-q").value=RS.query;rsFind(RS.query,true)}
  rsWire(el);RS.raf=0;rsKick();
  if(RS.openOnMount){RS.openOnMount=false;requestAnimationFrame(()=>requestAnimationFrame(rsOpen))}
}
function rsUnmount(){if(RS.raf)cancelAnimationFrame(RS.raf);RS.raf=0;RS.el=null;}

function rsWire(el){
  el.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
    if(b.dataset.rsmod){rsJump(RS_ITEMS.findIndex(i=>i.m===b.dataset.rsmod));return}
    if(b.dataset.rsfind){rsFindStep(1);return}
    if(b.classList.contains("rs-arrow"))rsGo(Math.round(RS.T)+(b.classList.contains("l")?-1:1));});
  const q=el.querySelector(".rs-q");
  q.addEventListener("input",()=>rsFind(q.value));
  q.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();if(RS.q.length)rsFindStep(e.shiftKey?-1:1)}
    else if(e.key==="Escape"&&q.value){e.preventDefault();q.value="";rsFind("")}});
  const sh=RS.shelf;
  sh.addEventListener("pointerover",e=>{const t=e.target.closest(".rs-tape");RS.hov=t?+t.dataset.v:-1;rsKick()});
  sh.addEventListener("pointerleave",()=>{RS.hov=-1;rsKick()});
  sh.addEventListener("pointerdown",e=>{if(e.button)return;RS.drag={x:e.clientX,T0:RS.T,on:false,id:e.pointerId}});
  sh.addEventListener("pointermove",e=>{const d=RS.drag;if(!d)return;const dx=e.clientX-d.x;
    if(!d.on&&Math.abs(dx)>5){d.on=true;try{sh.setPointerCapture(d.id)}catch(_){}}
    if(d.on)rsGo(d.T0-dx/(RS.G.ws+RS.G.gap));});
  const up=e=>{const d=RS.drag;RS.drag=null;if(!d)return;
    if(d.on){rsGo(Math.round(RS.T));return}
    if(e.type!=="pointerup")return;
    const t=e.target.closest(".rs-tape");
    if(t){const r=rsRel(+t.dataset.v);if(Math.abs(r)<.5)rsOpen();else rsGo(Math.round(RS.T+r));}
    else if(RS.onCover)rsOpen();};
  sh.addEventListener("pointerup",up);sh.addEventListener("pointercancel",up);
  el.addEventListener("wheel",e=>{if(RS.open)return;const dx=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.shiftKey?e.deltaY:0;if(!dx)return;
    e.preventDefault();rsGo(RS.T+dx/(RS.G.ws+RS.G.gap)*.5);clearTimeout(RS.wheelT);RS.wheelT=setTimeout(()=>rsGo(Math.round(RS.T)),160);},{passive:false});
}
const rsRel=v=>{const L=3*RS.N;return rsMod(v-RS.s+L/2,L)-L/2};
function rsJump(i){if(i<0)return;const N=RS.N,c=Math.round(RS.T);let d=rsMod(i-c,N);if(d>N/2)d-=N;rsGo(c+d);}

/* ---------- search: every word must appear in the item text, source or module name ---------- */
function rsFind(raw,keep){RS.query=raw;const w=raw.toLowerCase().trim().split(/\s+/).filter(Boolean);
  RS.q=w.length?RS_ITEMS.map((it,i)=>w.every(x=>it.hay.includes(x))?i:-1).filter(i=>i>=0):[];RS.mi=0;
  const hit=new Set(RS.q);RS.tapes.forEach((T,v)=>T.t.classList.toggle("dim",w.length>0&&!hit.has(v%RS.N)));
  RS.el.querySelector(".rs-find").classList.toggle("has",w.length>0);
  if(RS.q.length&&!keep){const c=rsMod(Math.round(RS.T),RS.N),j=RS.q.indexOf(c);RS.mi=j>=0?j:0;rsJump(RS.q[RS.mi])}
  rsHits();rsKick();}
function rsFindStep(d){if(!RS.q.length)return;RS.mi=rsMod(RS.mi+d,RS.q.length);rsJump(RS.q[RS.mi]);rsHits();}
function rsHits(){const h=RS.el.querySelector(".rs-hits");h.textContent=!RS.query.trim()?"":RS.q.length?`${RS.mi+1} / ${RS.q.length}`:"No match";}

function rsSetActive(i,dir,first){if(i===RS.act)return;RS.act=i;const it=RS_ITEMS[i],el=RS.el;
  const [t,sub,yr]=el.querySelectorAll(".rs-m");
  rsSwap(t,it.title,dir,first);rsSwap(sub,`${BOOK_GROUPS[it.m]} · <span>${rsScope(it.scope)}</span>`,dir,first);rsSwap(yr,`${it.its.length} key point${it.its.length>1?"s":""} · ${it.srcShort} · ${String(it.k+1).padStart(2,"0")} / ${REF_BOOKS[it.m].length}`,dir,first);el.style.setProperty("--g",RS_COL[it.m]);
  el.querySelectorAll(".rs-tab").forEach(b=>b.classList.toggle("on",b.dataset.rsmod===it.m));rsInd();
  if(RS.q.length){const j=RS.q.indexOf(i);if(j>=0&&j!==RS.mi){RS.mi=j;rsHits()}}
  clearTimeout(RS.saveT);RS.saveT=setTimeout(()=>{if(S.refItem!==it.key){S.refItem=it.key;save()}},600);
  if(it.m!==refGrp||it.mod!==refMod||first){refGrp=it.m;refMod=it.mod;RS.lastMod=refGrp;
    const dk=document.getElementById("rsDeck"),om=document.getElementById("rsMod");
    if(dk){dk.dataset.deck=refMod;dk.querySelector("span").textContent=`Flip cards · ${MODS[refMod]} (${CHANGES[refMod].length})`}
    if(om)om.dataset.courseOpen=refMod;}
}
function rsSwap(m,html,dir,instant){
  if(instant||RM){m.innerHTML=`<span>${html}</span>`;return}
  const n=document.createElement("span");n.innerHTML=html;m.appendChild(n);
  const o={duration:650,easing:EASE,fill:"both"};
  n.animate([{transform:`translateY(${dir*105}%)`},{transform:"translateY(0)"}],o);
  [...m.children].forEach(c=>{if(c===n||c.dataset.out)return;c.dataset.out=1;const cur=getComputedStyle(c).transform;
    c.animate([{transform:cur==="none"?"translateY(0)":cur},{transform:`translateY(${-dir*105}%)`}],o).onfinish=()=>c.remove();});
}

function rsFrame(t){
  if(!RS.el||!RS.el.isConnected){rsUnmount();return}
  const dt=Math.min(.05,RS.lt?(t-RS.lt)/1000:.016);RS.lt=t;
  const g=RS.G,N=RS.N,L=3*N,dragging=RS.drag&&RS.drag.on,k=RM?1e3:dragging?18:5.2;
  RS.s+=(RS.T-RS.s)*(1-Math.exp(-k*dt));if(Math.abs(RS.T-RS.s)<1e-4)RS.s=RS.T;
  if(Math.abs(RS.s)>8*L){const sh=Math.trunc(RS.s/L)*L;RS.s-=sh;RS.T-=sh;}
  const a=rsMod(Math.round(RS.s),N);if(a!==RS.act)rsSetActive(a,Math.sign(RS.T-RS.s)||1);
  const R=RS.shelf.getBoundingClientRect(),X0=R.left+R.width/2,Y0=R.top+R.height/2,settle=Math.abs(RS.T-RS.s);
  RS.onCover=!RS.open&&settle<.3&&Math.abs(RS.mx-X0)<.55*g.d&&Math.abs(RS.my-Y0)<.55*g.H;
  const tY=RS.onCover?(RS.mx-X0)/(.55*g.d)*9:RS.mx>-1e3?Math.max(-1,Math.min(1,(RS.mx-X0)/g.W))*5:0, tX=RS.onCover?-(RS.my-Y0)/(g.H/2)*6:0, e7=1-Math.exp(-7*dt), e12=RM?1:1-Math.exp(-12*dt);
  RS.tiltY+=(tY-RS.tiltY)*e7;RS.tiltX+=(tX-RS.tiltX)*e7;
  let busy=RS.s!==RS.T||dragging||Math.abs(tY-RS.tiltY)>.01||Math.abs(tX-RS.tiltX)>.01;
  const lim=g.W/2+1.5*g.d;
  for(let v=0;v<L;v++){const T=RS.tapes[v],r=rsMod(v-RS.s+L/2,L)-L/2,x=r*(g.ws+g.gap)+(g.d-g.ws+1.6*g.gap)*rsB(r);
    if(Math.abs(x)>lim){if(!T.hid){T.t.style.visibility="hidden";T.hid=1}continue}
    if(T.hid){T.t.style.visibility="";T.hid=0}
    const o=rsSmooth(Math.max(0,1-Math.abs(r))),lt=v===RS.hov&&Math.abs(r)>.5?1:0;RS.lift[v]+=(lt-RS.lift[v])*e12;
    if(Math.abs(lt-RS.lift[v])>.002)busy=true;else RS.lift[v]=lt;
    const y=-o*.025*g.H-RS.lift[v]*.045*g.H;
    T.t.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${(o*.2*g.H).toFixed(2)}px) rotateZ(${(-4.5*o).toFixed(3)}deg) rotateX(${(RS.tiltX*o).toFixed(3)}deg) rotateY(${(-90*o+RS.tiltY*o).toFixed(3)}deg)`;
    T.t.style.zIndex=Math.round(100-Math.abs(r)*4);
    T.sp.style.setProperty("--shade",(o*.55).toFixed(3));T.cv.style.setProperty("--shade",((1-o)*.5).toFixed(3));}
  RS.shelf.classList.toggle("oncv",RS.onCover||RS.hov>=0);
  // pause the loop once everything has settled; any input calls rsKick() to restart it
  RS.idle=busy?0:RS.idle+1;
  RS.raf=RS.idle>20?0:requestAnimationFrame(rsFrame);
}

/* ---------- detail sheet: grows out of the cover, text rises, poster bleeds in like ink ---------- */
const RS_BLOBS=[[150,330,0],[340,600,120],[250,120,220],[90,760,300],[400,250,360],[260,860,420],[230,470,180]];
function rsSheet(){let d=document.getElementById("rsd");if(d)return d;
  d=document.createElement("div");d.id="rsd";d.className="rsd";d.setAttribute("role","dialog");d.setAttribute("aria-modal","true");d.setAttribute("aria-labelledby","rsdT");
  d.innerHTML=`<button class="rs-box lbl rsd-close" data-rsd="close">Close</button><div class="rsd-logo"><b>HMCAS</b><span>CPG v2.6 · Quick reference</span></div>
  <div class="rsd-nav"><button class="rs-box lbl" data-rsd="prev" aria-label="Previous item">${RS_ARROW(-1)}</button><span class="lbl rsd-pos"></span><button class="rs-box lbl" data-rsd="next" aria-label="Next item">${RS_ARROW(1)}</button></div>
  <div class="rsd-grid"><div class="rsd-txt">
   <div class="rsd-m"><span class="lbl rsd-sub"></span></div><div class="rsd-m"><h2 id="rsdT"></h2></div><div class="rsd-m"><span class="lbl rsd-meta"></span></div>
   <div class="rsd-m"><ul class="rsd-body"></ul></div><div class="rsd-m"><p class="rsd-cred"></p></div>
   <div class="rsd-m rsd-acts"><button class="rs-box lbl rsd-go" data-rsd="deck"></button><button class="rs-box lbl rsd-go ghost" data-rsd="mod">Open module</button><button class="rs-box lbl rsd-go ghost rsd-vt" data-rsd="vis" aria-expanded="false"></button></div>
   <div class="rsd-vbox visual" hidden></div></div>
   <div class="rsd-poster"><svg viewBox="0 0 474 900" aria-hidden="true"><defs><filter id="rsInk" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".011" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" scale="120" xChannelSelector="R" yChannelSelector="G"/></filter>
    <mask id="rsMask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="874" height="1300"><g filter="url(#rsInk)">${RS_BLOBS.map(b=>`<circle cx="${b[0]}" cy="${b[1]}" r="0" fill="#fff"/>`).join("")}</g></mask>
    <pattern id="rsDots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.3" fill="rgba(255,255,255,.16)"/></pattern><clipPath id="rsClip"><rect width="474" height="900" rx="4"/></clipPath></defs>
    <g clip-path="url(#rsClip)" mask="url(#rsMask)"><rect class="rsd-pbg" width="474" height="900"/><rect class="rsd-band" x="30" y="165" width="414" height="585" rx="6"/><rect x="30" y="165" width="414" height="585" rx="6" fill="url(#rsDots)"/>
     <image class="rsd-img" x="57" y="195" width="360" height="525" preserveAspectRatio="xMidYMid meet"/>
     <text x="30" y="58" class="rsd-pk">HMCAS · CPG v2.6</text><text x="30" y="96" class="rsd-pm"></text>
     <text x="30" y="830" class="rsd-ps"></text><rect class="rsd-pbx" x="364" y="796" width="80" height="46" rx="4" fill="none" stroke-width="3"/><text x="404" y="828" text-anchor="middle" class="rsd-pb">v2.6</text></g></svg></div></div>`;
  document.body.appendChild(d);
  d.addEventListener("click",e=>{const b=e.target.closest("[data-rsd]");if(!b)return;const a=b.dataset.rsd;
    if(a==="close"){rsClose();return}
    if(a==="prev"||a==="next"){rsStep(a==="prev"?-1:1);return}
    if(a==="vis"){RS.vis=!RS.vis;rsVis(RS_ITEMS[RS.act]);if(RS.vis&&!RM)d.querySelector(".rsd-vbox").animate([{transform:"translateY(14px) scale(.98)"},{transform:"none"}],{duration:450,easing:EASE});return}
    rsClose(true);if(a==="deck")openDeck(refMod);else go("course",refMod);});
  return d;
}
function rsVis(it){const d=rsSheet(),v=it.visual,b=d.querySelector(".rsd-vt"),box=d.querySelector(".rsd-vbox");
  b.hidden=!v;if(!v){box.hidden=true;return}
  b.textContent=`${RS.vis?"Hide":"Show"} · ${RS_VIS[v]||"module chart"}`;b.setAttribute("aria-expanded",RS.vis);
  if(box.dataset.v!==v){box.innerHTML=V[v];box.dataset.v=v}box.hidden=!RS.vis;}
// book title on the poster: wrapped into up to 3 lines (SVG text does not wrap), smaller type for longer titles
function rsPosterTitle(t,title){const max=title.length>34?24:title.length>16?20:16,lines=[];
  title.toUpperCase().split(" ").forEach(w=>{const l=lines[lines.length-1];if(l&&(l+" "+w).length<=max)lines[lines.length-1]=l+" "+w;else lines.push(w)});
  const fs=lines.length>2?24:lines.length>1?29:34;t.setAttribute("font-size",fs);t.style.fontSize=fs+"px";
  t.innerHTML=lines.slice(0,3).map((l,i)=>`<tspan x="30" dy="${i?Math.round(fs*1.1):0}">${l.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</tspan>`).join("");}
function rsFill(it){const d=rsSheet();
  d.querySelector(".rsd-sub").innerHTML=`${BOOK_GROUPS[it.m]} · ${it.its.length} key point${it.its.length>1?"s":""}`;
  d.querySelector("#rsdT").innerHTML=it.title;d.querySelector(".rsd-meta").innerHTML=`${rsScope(it.scope)} · sources listed under each point`;
  d.querySelector(".rsd-body").innerHTML=it.its.map(rsItemHTML).join("");d.querySelector(".rsd-cred").textContent=`HMCAS Clinical Practice Guidelines v2.6 · ${BOOK_GROUPS[it.m]}`;
  d.querySelector(".rsd-pos").textContent=`${BOOK_GROUPS[it.m]} ${String(it.k+1).padStart(2,"0")} / ${REF_BOOKS[it.m].length}`;
  d.querySelector('[data-rsd="deck"]').textContent=`Flip cards · ${MODS[it.mod]}`;
  d.querySelector(".rsd-band").setAttribute("fill",RS_COL[it.m]);d.querySelector(".rsd-img").setAttribute("href",it.img);
  rsPosterTitle(d.querySelector(".rsd-pm"),it.title);d.querySelector(".rsd-pk").textContent=`HMCAS · ${BOOK_GROUPS[it.m].toUpperCase()}`;d.style.setProperty("--g",RS_COL[it.m]);d.querySelector(".rsd-ps").textContent=rsScope(it.scope).replace("&amp;","&").toUpperCase();
  rsVis(it);}
function rsReveal(textDelay,inkDelay){const d=rsSheet(),circles=[...d.querySelectorAll("#rsMask circle")];circles.forEach(c=>c.setAttribute("r",0));
  d.querySelectorAll(".rsd-m>*").forEach(x=>{x.getAnimations().forEach(a=>a.cancel());x.animate([{transform:"translateY(110%)"},{transform:"translateY(0)"}],{duration:RM?1:900,delay:RM?0:textDelay+[...x.parentNode.parentNode.children].indexOf(x.parentNode)*75,easing:EASE,fill:"both"})});
  const t0=performance.now()+(RM?-5000:inkDelay),run=++RS.inkRun;
  const ink=now=>{if(!RS.open||run!==RS.inkRun)return;const e=now-t0;
    circles.forEach((c,i)=>{const p=Math.max(0,Math.min(1,(e-RS_BLOBS[i][2])/1250));c.setAttribute("r",(720*(1-Math.pow(1-p,3))).toFixed(1))});
    if(e<2400)requestAnimationFrame(ink);};requestAnimationFrame(ink);}
RS.inkRun=0;
const rsHash=h=>{try{history.replaceState(null,"","#"+h)}catch(e){}};
const rsCoverRect=()=>{const v=rsMod(Math.round(RS.T),3*RS.N),T=RS.tapes&&RS.tapes[v];return T&&RS.el&&RS.el.isConnected?T.cv.getBoundingClientRect():{top:innerHeight/2,left:innerWidth/2,right:innerWidth/2,bottom:innerHeight/2,width:0,height:0}};
const rsInset=r=>`inset(${Math.max(0,r.top)}px ${Math.max(0,innerWidth-r.right)}px ${Math.max(0,innerHeight-r.bottom)}px ${Math.max(0,r.left)}px round 3px)`;
function rsOpen(){if(RS.open||!RS.el)return;RS.T=Math.round(RS.T);const i=rsMod(RS.T,RS.N),it=RS_ITEMS[i],d=rsSheet();
  rsFill(it);rsHash("reference/"+it.key);
  const r=rsCoverRect();RS.open=true;rsKick();d.classList.add("show");d.scrollTop=0;document.body.style.overflow="hidden";
  d.style.transformOrigin=`${r.left+r.width/2}px ${r.top+r.height/2}px`;
  d.getAnimations().forEach(a=>a.cancel());
  d.animate([{clipPath:rsInset(r),transform:"rotate(-4.5deg)"},{clipPath:"inset(0px 0px 0px 0px round 0px)",transform:"rotate(0deg)"}],{duration:RM?1:1050,easing:SHEET_EASE,fill:"both"});
  rsReveal(620,520);
  setTimeout(()=>d.querySelector(".rsd-close").focus({preventScroll:true}),RM?0:400);
}
function rsStep(dir){rsGo(Math.round(RS.T)+dir);if(!RS.open)return;const it=RS_ITEMS[rsMod(RS.T,RS.N)];
  rsFill(it);rsHash("reference/"+it.key);rsSheet().scrollTop=0;rsReveal(0,60);}
function rsClose(instant){const d=document.getElementById("rsd");if(!d||!RS.open)return;RS.open=false;rsKick();document.body.style.overflow="";
  if(view==="reference")rsHash("reference");
  const done=()=>{d.classList.remove("show");d.getAnimations({subtree:true}).forEach(a=>a.cancel());const f=RS.el&&RS.el.querySelector(".rs-arrow.r");if(f)f.focus({preventScroll:true});};
  if(instant||RM||!RS.el){done();return}
  const r=rsCoverRect();d.getAnimations().forEach(a=>{if(a.effect&&a.effect.target===d)a.cancel()});
  d.animate([{clipPath:"inset(0px 0px 0px 0px round 0px)",transform:"rotate(0deg)"},{clipPath:rsInset(r),transform:"rotate(-4.5deg)"}],{duration:850,easing:SHEET_EASE,fill:"both"}).onfinish=done;
}

/* ---------- global listeners (registered once) ---------- */
addEventListener("pointermove",e=>{if(e.pointerType==="mouse"||e.pointerType==="pen"){RS.mx=e.clientX;RS.my=e.clientY;if(RS.el)rsKick()}},{passive:true});
addEventListener("scroll",()=>{if(RS.el)rsKick()},{passive:true,capture:true});
addEventListener("resize",()=>{if(RS.el&&RS.el.isConnected){rsGeom();rsInd();rsKick()}});
document.addEventListener("keydown",e=>{
  if(!RS.el||!RS.el.isConnected||P||simOpen||document.getElementById("gate")||document.querySelector(".tour"))return;
  if(RS.open){if(e.key==="Escape"){e.preventDefault();rsClose()}else if((e.key==="ArrowLeft"||e.key==="ArrowRight")&&!/INPUT|TEXTAREA/.test(e.target.tagName)){e.preventDefault();rsStep(e.key==="ArrowLeft"?-1:1)}return}
  if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  if(e.key==="/"){e.preventDefault();const q=RS.el.querySelector(".rs-q");q.focus();q.select();return}
  if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();rsGo(Math.round(RS.T)+(e.key==="ArrowLeft"?-1:1));}
  else if(e.key==="Enter"&&(e.target===document.body||e.target===RS.el)){e.preventDefault();rsOpen();}
});
