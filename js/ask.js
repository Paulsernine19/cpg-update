/* ============================ ASK CPG (offline chat) ============================
   Answers ONLY from approved course content: the quick reference items (REF) and the lesson "read" steps.
   No generated clinical text: each answer is an existing item, shown with its CPG citation.
   Matching: words → canonical terms (ASK_SYN, phrases first), light stemming, BM25 ranking, typo tolerance.
   A question with a clinical word the course doesn't contain gets "not covered", never a guess. */
const ASK_PHRASE=[["tranexamic acid","txa"],["seat belt","seatbelt"],["heart rate","hr"],["blood pressure","bp"],["mean arterial pressure","map"],["cardiac arrest","arrest"],
 ["head injury","tbi"],["brain injury","tbi"],["spinal motion restriction","smr"],["three way tap","threeway"],["three-way","threeway"],["3 way","threeway"],["3-way","threeway"],
 ["giving set","givingset"],["skin to skin","skintoskin"],["skin-to-skin","skintoskin"],["c collar","collar"],["c-collar","collar"],["cervical collar","collar"],["blood loss","bleed"],
 ["pain relief","analgesia"],["large vessel occlusion","lvo"],["return of spontaneous circulation","rosc"],["dual sequential","dsed"],["double sequential","dsed"],["inflation breaths","inflation"],["inflation breath","inflation"],["stand for"," "],["stands for"," "]];
const ASK_SYN={tranexamic:"txa",paed:"paed",paeds:"paed",pediatric:"paed",paediatric:"paed",child:"paed",children:"paed",kid:"paed",kids:"paed",infant:"paed",
 neonate:"newborn",neonatal:"newborn",neonates:"newborn",baby:"newborn",babies:"newborn",haemorrhage:"bleed",hemorrhage:"bleed",bleeding:"bleed",haemorrhagic:"bleed",hemorrhagic:"bleed",
 defibrillation:"defib",defibrillator:"defib",defibrillate:"defib",shocks:"shock",resuscitation:"resus",cpr:"resus",o2:"oxygen",temperature:"temp",hypothermic:"hypothermia",
 ventilation:"ventil",ventilate:"ventil",ventilating:"ventil",ventilations:"ventil",extricate:"extric",extrication:"extric",extricating:"extric",extricated:"extric",
 immobilisation:"immobil",immobilization:"immobil",immobilise:"immobil",immobilize:"immobil",immobilised:"immobil",doses:"dose",dosing:"dose",dosage:"dose",
 analgesic:"analgesia",norepinephrine:"noradrenaline",epinephrine:"adrenaline",pressor:"vasopressor",pressors:"vasopressor",premature:"preterm",prem:"preterm",
 thermoregulation:"thermal",warming:"warm",warmth:"warm",compression:"compressions",pad:"pads",weeks:"week",gestation:"week",gestational:"week",minutes:"min",mins:"min",
 hours:"hour",hrs:"hour",years:"year",yrs:"year",spine:"spinal",cord:"spinal",stroke:"stroke",strokes:"stroke",kilogram:"kg",kilograms:"kg",ml:"ml",millilitre:"ml",milliliter:"ml"};
const ASK_STOP=new Set(("a an the and or of for to in on at by with from into is are was be been being do does did can could should would will shall may might must i we you he she they it "+
 "my our your their me us what which who whom whose when where why how much many any some all this that these those there here than then also just only about please tell "+
 "know explain show need needs want give given gives patient patients pt pts case new changed change changes update updated cpg v2 v26 version say says says mean means "+
 "use used using get got make made take taken if not no yes ok okay still now after before during per vs versus "+
 "acid whether someone something thing things really best right correct correctly exactly look looking find").split(" "));
const askPlain=s=>String(s||"").replace(/<[^>]+>/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&[a-z]+;/g," ");
const askNorm=s=>{s=" "+askPlain(s).toLowerCase().replace(/[‐-―]/g,"-")+" ";ASK_PHRASE.forEach(([a,b])=>{s=s.split(a).join(" "+b+" ")});return s};
const askStem=w=>{if(ASK_SYN[w])return ASK_SYN[w];if(/^\d/.test(w))return w;if(w.length>4&&/ies$/.test(w))w=w.slice(0,-3)+"y";else if(w.length>3&&/[^s]s$/.test(w))w=w.slice(0,-1);return ASK_SYN[w]||w};
const askToks=s=>askNorm(s).split(/[^a-z0-9₂]+/).filter(w=>w&&!ASK_STOP.has(w)).map(askStem).filter(w=>w&&!ASK_STOP.has(w));

// generic question words: they qualify the subject but must not decide the answer
const ASK_GEN=new Set("dose criteria criterion target indication management treatment time rate when much many amount volume first sign signs rule".split(" ").map(w=>askStem(w)));
const askW=(X,w)=>X.idf[w]*(ASK_GEN.has(w)?.35:1);
let ASKX=null;
function askIndex(){if(ASKX)return ASKX;const docs=[];
  const bookOf={};if(typeof RS_ITEMS!=="undefined")RS_ITEMS.forEach(b=>b.its.forEach(it=>{if(!bookOf[it.t])bookOf[it.t]=b}));
  Object.keys(REF).forEach(m=>REF[m].items.forEach((it,i)=>{if(it.pend)return;const lab=(it.t.match(/^<b>([^<]+?):?<\/b>/)||[])[1],bk=bookOf[it.t];
    docs.push({id:`r-${m}-${i}`,mod:m,title:askPlain(lab||(bk&&bk.title)||MODS[m]||"Reference").replace(/:$/,"").trim(),html:it.t.replace(/^<b>[^<]+<\/b>\s*/,"").replace(/^[a-z]/,c=>c.toUpperCase()),src:it.src,scope:it.scope,book:bk&&bk.key,
      text:`${lab||""} ${lab||""} ${bk?bk.title:""} ${it.t}`})}));
  COURSES.forEach(c=>{if(c.id==="final"||c.id==="intro")return;allLessons(c).forEach(l=>(l.steps||[]).forEach((s,k)=>{if(s.type!=="read"||!s.src)return;
    const html=`${s.body?`<p>${s.body}</p>`:""}${s.points?`<ul>${s.points.map(p=>`<li>${p}</li>`).join("")}</ul>`:""}`;if(!html)return;
    docs.push({id:`l-${l.id}-${k}`,mod:c.id,title:askPlain(s.title).trim(),html,src:s.src,scope:s.scope,lid:l.id,step:k,ltitle:l.title,text:`${s.title} ${s.title} ${s.ptitle||""} ${s.body||""} ${(s.points||[]).join(" ")}`})}))});
  const df={};docs.forEach(d=>{const tk=askToks(d.text),tf={};tk.forEach(w=>tf[w]=(tf[w]||0)+1);d.tf=tf;d.len=tk.length;Object.keys(tf).forEach(w=>df[w]=(df[w]||0)+1)});
  const N=docs.length,avg=docs.reduce((a,d)=>a+d.len,0)/N,idf={};Object.keys(df).forEach(w=>idf[w]=Math.log(1+(N-df[w]+.5)/(df[w]+.5)));
  const fz={};Object.keys(df).forEach(w=>fz[w]=w);Object.keys(ASK_SYN).forEach(w=>{if(df[ASK_SYN[w]])fz[w]=ASK_SYN[w]});
  return ASKX={docs,idf,avg,fz,vocab:Object.keys(fz)};}
// typo tolerance: nearest known word (or synonym) within 1 edit, 2 for words of 9+ letters
function askLev(a,b,max){if(Math.abs(a.length-b.length)>max)return max+1;let p=[...Array(b.length+1).keys()];
  for(let i=1;i<=a.length;i++){const c=[i];let lo=i;for(let j=1;j<=b.length;j++){c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));lo=Math.min(lo,c[j])}if(lo>max)return max+1;p=c}return p[b.length]}
function askFix(w,X){if(X.idf[w]!==undefined||/^\d/.test(w))return w;if(w.length<5)return null;const max=w.length>=9?2:1;let best=null,bd=max+1;
  X.vocab.forEach(v=>{if(v[0]!==w[0])return;const d=askLev(w,v,max);if(d<bd||d===bd&&best&&X.idf[v]<X.idf[best]){bd=d;best=v}});return bd<=max?X.fz[best]:null}
function askSearch(q){const X=askIndex(),raw=[...new Set(askToks(q))],terms=[],miss=[];
  raw.forEach(w=>{const f=askFix(w,X);if(f&&X.idf[f]!==undefined)terms.push(f);else if(/^[a-z]{5,}$/.test(w))miss.push(w)});
  const uniq=[...new Set(terms)];if(!uniq.length)return {hits:[],miss,terms:uniq};
  // BM25, scaled by the share of the question's specific words (idf) that the item contains: "adrenaline dose" must not answer with the TXA dose
  const k1=1.2,b=.75,tot=uniq.reduce((a,w)=>a+askW(X,w),0);const hits=X.docs.map(d=>{let s=0,m=0,cv=0;uniq.forEach(w=>{const f=d.tf[w];if(!f)return;m++;cv+=askW(X,w);s+=askW(X,w)*(f*(k1+1))/(f+k1*(1-b+b*d.len/X.avg))});
    return {d,s:s*(cv/tot)**2,m,cov:cv/tot}}).filter(h=>h.m).sort((a,b)=>b.s-a.s);
  return {hits,miss,terms:uniq};}

/* ---------- chat panel ---------- */
const ASK_SUGG={trauma:["TXA dose","Self-extrication criteria","Trauma bypass criteria","MAP target in neurogenic shock"],
  newborn:["Inflation breaths","Oxygen for inflation breaths","Newborn temperature","When to start compressions"],
  cardiac:["Pads placement","DSED","Paediatric defibrillation"],stroke:["RACE score","LVO destination"]};
const ASK_START=["TXA dose","Self-extrication criteria","Inflation breaths","Pads placement","RACE score"];
const ASK_SAY=Object.fromEntries(ASK_PHRASE.map(([a,b])=>[b,a])),askSay=ws=>ws.map(w=>ASK_SAY[w]||w).join(", ");
const ASK_HELLO=/^(hi|hello|hey|salam|assalam|good (morning|afternoon|evening))\b/i,ASK_THANKS=/^(thanks|thank you|thx|great|ok thanks|cheers)\b/i;
let AK=null;
I.ask='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" fill="currentColor"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" fill="currentColor" stroke-width="1.2"/></svg>';
const askTime=()=>new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});
const askEsc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const askChips=list=>list.length?`<div class="ak-chips">${list.map(x=>typeof x==="string"?`<button class="ak-chip" data-aq="${askEsc(x)}">${askEsc(x)}${I.left}</button>`:`<button class="ak-chip" data-adoc="${x.id}">${askEsc(x.title)}${I.left}</button>`).join("")}</div>`:"";
function askDocHTML(d){const c=courseById(d.mod),lk=d.lid&&lessonById(d.lid),open=lk&&isUnlocked(lk.c,lk.l);
  return `<div class="ak-ans"><div class="ak-meta"><span class="ak-mod" style="--mc:var(--c-${d.mod})">${MODS[d.mod]||(c&&c.title)||""}</span></div>
   <h3>${askEsc(d.title)}</h3><div class="ak-body">${typeof rsNums==="function"?rsNums(d.html):d.html}</div><p class="ak-src">${d.src}</p>
   ${d.book||open?`<div class="ak-acts">${d.book?`<button class="ak-act" data-abook="${d.book}">${I.book} Open in Reference</button>`:""}${open?`<button class="ak-act" data-alesson="${d.lid}" data-astep="${d.step}">${I.play} Lesson: ${askEsc(d.ltitle)}</button>`:""}</div>`:""}</div>`}
function askReply(q){q=q.trim();if(ASK_HELLO.test(q)&&q.split(/\s+/).length<=3)return {html:`<p>Hello. Ask a question about the CPG v2.6 changes covered in this course, for example a dose, a threshold or a pathway.</p>`,chips:AK.mod&&ASK_SUGG[AK.mod]||ASK_START};
  if(ASK_THANKS.test(q)&&q.split(/\s+/).length<=3)return {html:`<p>You're welcome.</p>`,chips:[]};
  const r=askSearch(q),top=r.hits[0];
  // a word the course doesn't contain may be the real subject (e.g. another drug): never answer around it
  if(r.miss.length)return {html:`<p>“${askEsc(askSay(r.miss))}” isn't in this update course. Check the full CPG v2.6, or try other words.</p>`,chips:r.hits.slice(0,3).map(h=>h.d),rel:true};
  if(!top||top.cov<.5||top.s<.4)return {html:`<p>No match in the v2.6 course content. Check the full CPG v2.6, or try other words.</p>`,chips:ASK_START};
  const rel=r.hits.slice(1).filter(h=>h.s>=top.s*.45&&h.d.title!==top.d.title).filter((h,i,a)=>a.findIndex(x=>x.d.title===h.d.title)===i).slice(0,3).map(h=>h.d);
  return {html:askDocHTML(top.d),chips:rel,rel:true};}
function askMsg(who,html,chips,rel){const log=document.getElementById("akLog");if(!log)return;const el=document.createElement("div");el.className=`ak-row ${who}`;
  el.innerHTML=who==="bot"?`<div class="ak-av" aria-hidden="true">${I.ask}</div><div class="ak-col"><div class="ak-bub">${html}<time>${askTime()}</time></div>${chips&&chips.length?(rel?`<span class="ak-rel">Related</span>`:"")+askChips(chips):""}</div>`
    :`<div class="ak-bub">${html}<time>${askTime()}</time></div>`;
  log.appendChild(el);document.getElementById("akHero").classList.add("small");requestAnimationFrame(()=>el.scrollIntoView({block:who==="bot"?"start":"end",behavior:"smooth"}));}
function askAsk(q,docId){if(!AK||AK.busy)return;q=(q||"").trim();const X=askIndex(),d=docId&&X.docs.find(x=>x.id===docId);if(!q&&!d)return;
  askMsg("me",askEsc(d?d.title:q));const inp=document.getElementById("akIn");inp.value="";AK.busy=true;
  const ty=document.getElementById("akTyping");ty.hidden=false;
  setTimeout(()=>{ty.hidden=true;AK.busy=false;if(!AK)return;const r=d?{html:askDocHTML(d),chips:[],rel:false}:askReply(q);askMsg("bot",r.html,r.chips,r.rel)},matchMedia("(prefers-reduced-motion: reduce)").matches?0:550);}
function askOpen(mod){if(AK)return;AK={mod:ASK_SUGG[mod]?mod:null,busy:false,back:document.activeElement};const el=document.createElement("div");
  el.id="ask";el.className="ask";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Ask CPG v2.6");
  el.innerHTML=`<div class="ak-panel"><header class="ak-top"><div class="ak-mini" aria-hidden="true"></div><div><b>Ask CPG v2.6</b><small>Answers from the approved course content</small></div><button class="ak-x" data-aclose="1" aria-label="Close">${I.x||"×"}</button></header>
   <div class="ak-scroll"><div class="ak-hero" id="akHero"><div class="ak-orb" aria-hidden="true"><i class="o1"></i><i class="o2"></i><b></b></div>
     <p class="ak-live"><i></i>Offline · CPG v2.6 update content</p><h2>How can I help?</h2></div>
     <div class="ak-log" id="akLog" aria-live="polite"></div>
     <div class="ak-typing" id="akTyping" hidden><span></span><span></span><span></span><small>Searching the course content</small></div></div>
   <form class="ak-bar" id="akForm"><input id="akIn" type="text" autocomplete="off" enterkeyhint="send" maxlength="160" placeholder="Ask about a dose, threshold or pathway" aria-label="Your question"><button class="ak-send" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/></svg></button></form>
   <p class="ak-foot">Not a substitute for the full CPG v2.6. Each answer shows its source.</p></div>`;
  document.body.appendChild(el);document.body.style.overflow="hidden";
  askMsg("bot",`<p>Ask a question about the v2.6 changes in this course. Answers come only from the approved content, with the CPG page.</p>`,AK.mod?ASK_SUGG[AK.mod]:ASK_START);
  document.getElementById("akHero").classList.remove("small");
  el.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;e.stopPropagation();
    if(t.dataset.aclose){askClose();return}if(t.dataset.aq){askAsk(t.dataset.aq);return}if(t.dataset.adoc){askAsk("",t.dataset.adoc);return}
    if(t.dataset.abook){rsPeek(t.dataset.abook);return}
    if(t.dataset.alesson){const id=t.dataset.alesson,k=+t.dataset.astep;askClose(true);openLesson(id);if(P&&P.steps[k]){P.i=k;resetStep();drawPlayer()}return}});
  el.querySelector("#akForm").addEventListener("submit",e=>{e.preventDefault();askAsk(document.getElementById("akIn").value)});
  setTimeout(()=>document.getElementById("akIn").focus({preventScroll:true}),60);}
function askClose(noFocus){const el=document.getElementById("ask");if(!el)return;const b=AK&&AK.back;el.remove();AK=null;document.body.style.overflow="";if(!noFocus&&b&&b.focus)b.focus({preventScroll:true});}
addEventListener("keydown",e=>{if(AK&&e.key==="Escape"&&!(typeof RS!=="undefined"&&RS.peek)){e.preventDefault();e.stopImmediatePropagation();askClose()}},true);
