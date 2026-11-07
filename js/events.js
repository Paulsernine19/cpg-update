/* ============================ EVENTS ============================ */
let mdrag=null,mSkip=false;
document.addEventListener("click",e=>{
  if(mSkip){mSkip=false;return}
  const t=e.target.closest("button");if(!t)return;
  if(t.dataset.go){go(t.dataset.go);return}
  if(t.dataset.tx&&P&&P.steps){txClick(t);return}
  if(t.dataset.deck){if(P)closeLesson();openDeck(t.dataset.deck);return}
  if(t.dataset.ref){if(P)closeLesson();refMod=t.dataset.ref;go("reference");return}
  if(t.dataset.refmod){refMod=t.dataset.refmod;render();return}
  if(t.dataset.courseOpen){go("course",t.dataset.courseOpen);return}
  if(t.dataset.revisit){const id=t.dataset.revisit;closeLesson();openLesson(id);return}
  if(t.dataset.lesson){if(t.getAttribute("aria-disabled"))return;openLesson(t.dataset.lesson);return}
  if(t.dataset.filter){filter=t.dataset.filter;render();return}
  if(!P){const a=t.dataset.act;
    if(a==="reset"){confirmReset=true;render()} if(a==="reset-no"){confirmReset=false;render()}
    if(a==="reset-yes"){S=blank();save();confirmReset=false;render()}
    if(a==="theme"){const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;r.dataset.theme=dark?"light":"dark";}
    return;}
  if(P.mode==="deck"){const a=t.dataset.act;
    if(a==="flip"){P.flipped=!P.flipped;drawPlayer(".inner")}
    if(a==="deck-got"){S.cards[P.cards[P.ci].key]=true;save();P.known++;P.ci++;P.flipped=false;drawPlayer()}
    if(a==="deck-again1"){S.cards[P.cards[P.ci].key]=false;save();P.again.push(P.cards[P.ci]);P.ci++;P.flipped=false;drawPlayer()}
    if(a==="deck-again"){P.cards=P.again;P.again=[];P.known=0;P.ci=0;P.flipped=false;drawPlayer()}
    if(a==="close"||a==="finish")closeLesson();
    return;}
  if(t.dataset.act==="sim-close"){closeSim();return}
  if(t.dataset.act==="sim-open"){openSim();return}
  if(t.dataset.act==="sim-manual"){P.simManual=!P.simManual;drawPlayer('[data-act="sim-manual"]');return}
  if(t.dataset.conf){P.conf=t.dataset.conf;drawPlayer(`[data-conf="${P.conf}"]`);return}
  if(t.dataset.walk!==undefined){walkPick(+t.dataset.walk);return}
  if(t.dataset.opt&&!locked()){P.sel=+t.dataset.opt;P.status="idle";if(P.mode==="diag"){check();return}drawPlayer(`[data-opt="${P.sel}"]`);return}
  if(t.dataset.multi&&!locked()){const i=+t.dataset.multi;P.multi=P.multi.includes(i)?P.multi.filter(x=>x!==i):[...P.multi,i];P.status="idle";drawPlayer(`[data-multi="${i}"]`);return}
  if(t.dataset.ord!==undefined&&!locked()){P.ord.push(+t.dataset.ord);P.status="idle";drawPlayer(P.ord.length<P.steps[P.i].items.length?"[data-ord]":"[data-act=check]");return}
  if(t.dataset.unord!==undefined&&!locked()){P.ord.splice(+t.dataset.unord,1);P.status="idle";drawPlayer("[data-ord]");return}
  if(t.dataset.mcard!==undefined&&!locked()){const i=+t.dataset.mcard,sl=t.closest(".mslot");
    if(sl&&P.matchSel!==null&&P.matchSel!==i){matchPlace(+sl.dataset.k,P.matchSel);return}
    if(sl&&P.matchSel===i){delete P.match[sl.dataset.k];P.matchSel=null;P.status="idle";drawPlayer();return}
    P.matchSel=P.matchSel===i?null:i;drawPlayer(`[data-mcard="${i}"]`);return}
  if(t.dataset.mslot!==undefined&&!locked()){if(P.matchSel!==null)matchPlace(+t.dataset.mslot,P.matchSel);return}
  if(t.dataset.bin!==undefined&&!locked()){P.sort[t.dataset.card]=+t.dataset.bin;P.status="idle";drawPlayer(`[data-card="${t.dataset.card}"][data-bin="${t.dataset.bin}"]`);return}
  const a=t.dataset.act;if(!a)return;
  if(a==="watched"){P.watched=!P.watched;drawPlayer('[data-act="watched"]');return}
  if(a==="check")check(); if(a==="next")nextStep();
  if(a==="retry"){const s=P.steps[P.i];if(s.type==="match"){for(const k in P.match){if(P.match[k]!==+k)delete P.match[k]}P.matchSel=null}else if(s.type==="sort"){for(const k in P.sort){if(P.sort[k]!==s.cards[k].b)delete P.sort[k]}}else if(s.type==="order"){let k=0;while(k<P.ord.length&&P.ord[k]===k)k++;P.ord=P.ord.slice(0,k)}else{P.sel=null;P.val="";P.multi=[]}P.status="idle";drawPlayer()}
  if(a==="reveal"){P.status="revealed";drawPlayer()}
  if(a==="close"||a==="finish")closeLesson();
  if(a==="retake"){const id=P.l.id,m=P.l.txRun?P.txMode:undefined;closeLesson();openLesson(id,{txMode:m});}
  if(a==="tx-pressure"){const id=P.l.id;closeLesson();openLesson(id,{txMode:"pressure"});}
});
document.addEventListener("keydown",e=>{
  if(simOpen){if(e.key==="Escape")closeSim();return}
  if(!P)return;
  if(e.key==="Escape"){if(P.chartOpen){P.chartOpen=false;drawPlayer();return}closeLesson();return}
  if(P.mode==="deck"){if(e.key===" "&&e.target.tagName!=="BUTTON"&&P.ci<P.cards.length){e.preventDefault();P.flipped=!P.flipped;drawPlayer(".inner")}
    if(e.key==="Enter"&&e.target===document.body){const b=document.querySelector("#player .p-foot .btn:not(.ghost)");if(b){e.preventDefault();b.click()}}return}
  const s=P.steps[P.i];
  if(s&&s.type==="choice"&&!locked()&&P.status!=="complete"&&e.target.tagName!=="INPUT"){const k=e.key.toUpperCase();const i=k.charCodeAt(0)-65;if(k.length===1&&i>=0&&i<s.options.length){P.sel=i;P.status="idle";drawPlayer(`[data-opt="${i}"]`);return}}
  if(e.key==="Enter"&&e.target.classList&&e.target.classList.contains("labin")){e.preventDefault();const all=[...document.querySelectorAll(".labin")],n=all[all.indexOf(e.target)+1];if(n)n.focus();else e.target.blur();return}
  if(e.key==="Enter"&&(e.target.tagName==="INPUT"||e.target===document.body)){const b=document.querySelector("#player .p-foot .btn:not(.ghost):not([disabled])");if(b){e.preventDefault();b.click()}}
});
/* drag and drop for match steps: pointer events cover mouse, touch and pen */
document.addEventListener("pointerdown",e=>{const c=e.target.closest&&e.target.closest(".mcard");if(!c||c.disabled||!P||e.button>0)return;mdrag={i:+c.dataset.mcard,x:e.clientX,y:e.clientY,el:c,ghost:null,over:null};});
const mDrop=(x,y)=>{const n=document.elementFromPoint(x,y);return n&&n.closest?n.closest(".mslot"):null};
document.addEventListener("pointermove",e=>{if(!mdrag)return;
  if(!mdrag.ghost){if(Math.hypot(e.clientX-mdrag.x,e.clientY-mdrag.y)<6)return;const r=mdrag.el.getBoundingClientRect(),g=mdrag.el.cloneNode(true);g.classList.add("mghost");g.style.width=r.width+"px";document.body.appendChild(g);mdrag.ghost=g;mdrag.el.classList.add("mfrom");}
  mdrag.ghost.style.left=e.clientX+"px";mdrag.ghost.style.top=e.clientY+"px";
  const o=mDrop(e.clientX,e.clientY);if(o!==mdrag.over){if(mdrag.over)mdrag.over.classList.remove("over");if(o)o.classList.add("over");mdrag.over=o;}
  const b=document.querySelector("#player .p-body");if(b){const r=b.getBoundingClientRect();if(e.clientY<r.top+50)b.scrollTop-=8;else if(e.clientY>r.bottom-50)b.scrollTop+=8;}
});
const mEnd=(e,drop)=>{if(!mdrag)return;const d=mdrag;mdrag=null;if(!d.ghost)return;d.ghost.remove();d.el.classList.remove("mfrom");if(d.over)d.over.classList.remove("over");
  mSkip=true;setTimeout(()=>{mSkip=false},50);if(!drop)return;
  const o=mDrop(e.clientX,e.clientY);if(o)matchPlace(+o.dataset.k,d.i);else if(e.target.closest&&document.elementFromPoint(e.clientX,e.clientY)&&document.elementFromPoint(e.clientX,e.clientY).closest(".mpool")){for(const x in P.match)if(P.match[x]===d.i)delete P.match[x];P.status="idle";drawPlayer();}};
document.addEventListener("pointerup",e=>mEnd(e,true));
document.addEventListener("pointercancel",e=>mEnd(e,false));
document.addEventListener("input",e=>{if(e.target.dataset&&e.target.dataset.txin)txInput(e.target);});
window.addEventListener("hashchange",fromHash);
fromHash();
if(S.done["in-1"]&&!S.tourDone)tourStart(); // resume an unfinished first tour after a reload
