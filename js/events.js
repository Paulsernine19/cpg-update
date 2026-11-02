/* ============================ EVENTS ============================ */
document.addEventListener("click",e=>{
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
  if(t.dataset.bin!==undefined&&!locked()){P.sort[t.dataset.card]=+t.dataset.bin;P.status="idle";drawPlayer(`[data-card="${t.dataset.card}"][data-bin="${t.dataset.bin}"]`);return}
  const a=t.dataset.act;if(!a)return;
  if(a==="watched"){P.watched=!P.watched;drawPlayer('[data-act="watched"]');return}
  if(a==="check")check(); if(a==="next")nextStep();
  if(a==="retry"){const s=P.steps[P.i];if(s.type==="sort"){for(const k in P.sort){if(P.sort[k]!==s.cards[k].b)delete P.sort[k]}}else{P.sel=null;P.val="";P.multi=[]}P.status="idle";drawPlayer()}
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
  if(e.key==="Enter"&&(e.target.tagName==="INPUT"||e.target===document.body)){const b=document.querySelector("#player .p-foot .btn:not(.ghost):not([disabled])");if(b){e.preventDefault();b.click()}}
});
document.addEventListener("input",e=>{if(e.target.dataset&&e.target.dataset.txin)txInput(e.target);});
window.addEventListener("hashchange",fromHash);
fromHash();
if(S.done["in-1"]&&!S.tourDone)tourStart(); // resume an unfinished first tour after a reload
