/* ---------- Visuals (text-based; replace with approved algorithm artwork) ---------- */
const V={
 org:`<div class="org" style="justify-content:center"><img src="brand/hmcas-wordmark.webp" alt="Hamad Medical Corporation Ambulance Service"></div>`,
 ways:`<div class="ways"><div style="background:var(--good-soft);border-color:transparent"><span class="label">Routine pathway</span><b>Care of the newborn</b><small>New CPG 12.13 · breathing baby, no resuscitation needed</small></div><div style="background:var(--bad-soft);border-color:transparent"><span class="label">Resuscitation pathway</span><b>Newborn resuscitation</b><small>Revised CPG 2.5 · not breathing effectively</small></div></div><p class="note" style="margin-top:10px">A baby can move from routine care to resuscitation if they deteriorate. Reassess throughout.</p>`,
 timeline:`<svg viewBox="0 0 520 170" role="img" aria-label="Adult medical shockable arrest timeline: after shock 3 give adrenaline and amiodarone 300 mg; after shock 5 amiodarone 150 mg; adrenaline repeats every 4 minutes"><line x1="40" y1="60" x2="480" y2="60" stroke="var(--line)" stroke-width="4"/>${[1,2,3,4,5].map((n,i)=>`<circle cx="${60+i*100}" cy="60" r="20" fill="${n===3||n===5?'var(--c-cardiac)':'var(--sunken)'}"/><text x="${60+i*100}" y="66" text-anchor="middle" font-size="16" font-weight="700" fill="${n===3||n===5?'#fff':'var(--muted)'}">${n}</text>`).join("")}<text x="40" y="24" font-size="13" font-weight="700" fill="var(--muted)">SHOCK</text><text x="260" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">Adrenaline</text><text x="260" y="122" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">Amiodarone 300 mg</text><text x="460" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">Amiodarone 150 mg</text><text x="260" y="156" text-anchor="middle" font-size="12" fill="var(--muted)">then adrenaline every 4 minutes</text></svg>`,
 txachart:`<table class="txc" aria-label="Paediatric TXA dose chart"><thead><tr><th>Age (years)</th><th>Est. weight</th><th>Dose (15 mg/kg)</th><th>Volume (10 mg/mL)</th><th>≥8 years</th></tr></thead><tbody><tr><td>0–12 months</td><td>(months × 0.5) + 4</td><td colspan="3">15 mg/kg · calculated volume</td></tr><tr><td>1</td><td>10 kg</td><td>150 mg</td><td>15 mL</td><td>–</td></tr><tr><td>2</td><td>12 kg</td><td>180 mg</td><td>18 mL</td><td>–</td></tr><tr><td>3</td><td>14 kg</td><td>210 mg</td><td>21 mL</td><td>–</td></tr><tr><td>4</td><td>16 kg</td><td>240 mg</td><td>24 mL</td><td>–</td></tr><tr><td>5</td><td>18 kg</td><td>270 mg</td><td>27 mL</td><td>–</td></tr><tr><td>6</td><td>25 kg</td><td>370 mg</td><td>37 mL</td><td>–</td></tr><tr><td>7</td><td>28 kg</td><td>420 mg</td><td>42 mL</td><td>–</td></tr><tr class="band"><td colspan="5"><b>≥8 years or &gt;30 kg:</b> add 1 g to the 100 mL bag, draw out and discard the volume shown, then give the remaining volume over 10 minutes (includes 10 mL administration-set compensation).</td></tr><tr><td>8</td><td>31 kg</td><td>460 mg</td><td>46 mL</td><td class="out">Draw out 44 mL</td></tr><tr><td>9</td><td>34 kg</td><td>500 mg</td><td>50 mL</td><td class="out">Draw out 40 mL</td></tr><tr><td>10</td><td>37 kg</td><td>550 mg</td><td>55 mL</td><td class="out">Draw out 35 mL</td></tr><tr><td>11</td><td>40 kg</td><td>600 mg</td><td>60 mL</td><td class="out">Draw out 30 mL</td></tr><tr><td>12</td><td>43 kg</td><td>640 mg</td><td>64 mL</td><td class="out">Draw out 26 mL</td></tr><tr><td>13</td><td>46 kg</td><td>700 mg</td><td>70 mL</td><td class="out">Draw out 20 mL</td></tr><tr><td>14</td><td>49 kg</td><td>730 mg</td><td>73 mL</td><td class="out">Draw out 17 mL</td></tr></tbody></table><p class="note" style="margin-top:10px">All doses given IV over 10 minutes. Source: HMCAS Paediatric IV TXA poster.</p>`,
 race:`<table class="txc race" aria-label="RACE scale"><thead><tr><th>Item</th><th>0</th><th>1</th><th>2</th></tr></thead><tbody><tr><td><b>Facial palsy</b></td><td>Absent</td><td>Mild</td><td>Moderate / severe</td></tr><tr><td><b>Arm motor</b></td><td>Normal / mild</td><td>Moderate</td><td>Severe</td></tr><tr><td><b>Leg motor</b></td><td>Normal / mild</td><td>Moderate</td><td>Severe</td></tr><tr><td><b>Head &amp; gaze deviation</b></td><td>Absent</td><td>Present</td><td>–</td></tr><tr><td><b>Aphasia</b><br><small>if right hemiparesis</small></td><td>Performs both tasks</td><td>Performs 1 task</td><td>Performs neither</td></tr><tr><td><b>Agnosia</b><br><small>if left hemiparesis</small></td><td>Recognises arm and impairment</td><td>Doesn't recognise arm <i>or</i> impairment</td><td>Doesn't recognise both</td></tr><tr class="band"><td colspan="4"><b>Total 0–9.</b> RACE ≥5 suggests a large vessel occlusion.</td></tr></tbody></table><p class="note" style="margin-top:10px">Aphasia tasks: "Close your eyes" and "Make a fist". Agnosia tasks: show the weak arm, "Whose arm is this?", then "Can you lift both arms and clap?" Source: CPG 3.1 p.63.</p>`,
 ustep:`<ol class="ustep"><li><b>U</b><span>Understand</span><small>Check they understand: wind down the window or give a thumbs up.</small></li><li><b>S</b><span>Support</span><small>Reassure them. Explain you'll keep them safe, in language they understand.</small></li><li><b>T</b><span>Try moving</span><small>Ask them to move both legs. If they can't, they can't self-extricate.</small></li><li><b>E</b><span>Egress</span><small>Door fully open, all obstructions out of the way.</small></li><li><b>P</b><span>Plan</span><small>Where next? Chair or stretcher? Close to the vehicle?</small></li><li><b>OUT</b><span>Out</span><small>Ask them to step out. Support if required. Don't drag or lift.</small></li></ol><p class="note" style="margin-top:10px">First ask: does this casualty need a snatch rescue? Source: CPG 10.13 p.201 (U-STEP Out, post-collision.com).</p>`,
 tree:`<div class="tree"><div class="root">BEFAST positive · When was the patient last known well?</div>
  <div class="branch"><div class="if">≤ 8 hours</div><div class="p1"><b>P1 to HGH ED</b> · prenotify via CC:E</div></div>
  <div class="branch"><div class="if">Wake-up / unknown onset</div><div class="p1"><b>P1 to HGH ED</b> · prenotify via CC:E</div></div>
  <div class="branch"><div class="if">&gt; 8 to &lt; 24 hours, RACE ≥ 5</div><div class="p1"><b>P1 to HGH ED</b> · prenotify via CC:E</div></div>
  <div class="branch"><div class="if">&gt; 8 to &lt; 24 hours, RACE &lt; 5</div><div class="p2"><b>P2</b> to nearest appropriate ED</div></div>
  <div class="branch"><div class="if">≥ 24 hours</div><div class="p2"><b>P2</b> to nearest appropriate ED</div></div></div>`
};

/* ---------- Flip cards: "what changed" per module ----------
   kind: habit = a familiar routine to unlearn; removed = explicitly removed in v2.6; new = new or changed action */
const KIND={habit:"Habit to unlearn",removed:"Removed in v2.6",new:"What's new?"};
const CHANGES={
 trauma:[
  {kind:"habit",f:"Neck pain after a collision means a full immobilised extraction.",b:"Self-extrication or minimal assistance is now first line, including neck or back pain and soft neuro signs. Not if they can't follow instructions or can't stand on at least one leg.",src:"CPG 10.13 p.200"},
  {kind:"new",f:"A conscious trapped patient with no neuro deficit. Manual in-line stabilisation in the vehicle?",b:"Not needed. Keep monitoring to a minimum while trapped; only critical interventions (haemorrhage control, TXA, analgesia).",src:"CPG 10.13 p.200"},
  {kind:"new",f:"A child with an isolated TBI and GCS ≤12. Is TXA indicated?",b:"Yes, if the injury is under 3 hours old and there are no contraindications. Dose 15 mg/kg from the chart; 1 g in 100 mL = 10 mg/mL; give over 10 minutes.",src:"Circular rows 27–28 · HMCAS Paediatric IV TXA poster"},
  {kind:"habit",f:"Add 1 g TXA straight into the full 100 mL bag.",b:"Draw out 10 mL of saline first, then add 1 g (2 × 500 mg = 10 mL). That makes exactly 10 mg/mL.",src:"HMCAS Paediatric IV TXA poster"},
  {kind:"habit",f:"Mix the bag first and label it afterwards.",b:"Label immediately after preparation, then mix gently by turning the bag slowly a few times.",src:"HMCAS Paediatric IV TXA poster"},
  {kind:"new",f:"Child aged 8 or over, or over 30 kg: how do you give the dose?",b:"Draw out and discard the chart volume, then give the remaining volume over 10 minutes. It includes 10 mL for the administration set.",src:"HMCAS Paediatric IV TXA poster"},
  {kind:"habit",f:"Push TXA quickly to save time.",b:"Give it over 10 minutes. A rapid push can drop the child's blood pressure.",src:"HMCAS Paediatric IV TXA poster"},
  {kind:"removed",f:"TXA in the ectopic pregnancy, miscarriage, placental abruption and placenta praevia algorithms.",b:"Removed. In obstetrics, TXA is for postpartum haemorrhage only. Urgent haemorrhage care still applies.",src:"Circular rows 22–25, 29"},
  {kind:"new",f:"Abdominal seat belt sign with normal vital signs. Does it affect destination?",b:"Yes. It is now a trauma bypass criterion. Apply the CPG 10.10 destination decision.",src:"CPG 10.10 · Circular row 19"},
  {kind:"habit",f:"One MAP target for every spinal patient in shock.",b:"Isolated neurogenic shock: MAP 85–90 mmHg. Combined with haemorrhagic shock: MAP ≥65 mmHg.",src:"CPG 10.3 p.178"},
  {kind:"habit",f:"Keep every spinal patient on the combi-carrier all the way to hospital.",b:"Consider removing it once on the stretcher (keep it for the unconscious patient). Head blocks always. Stretcher may be raised up to 30°.",src:"CPG 10.3 p.178"}
 ],
 newborn:[
  {kind:"new",f:"A breathing newborn who needs no resuscitation. Which guideline?",b:"New CPG 12.13 Care of the newborn. Dry, warm hat and wrap are mandatory; keep temperature ≥36.5 °C.",src:"CPG 12.13 p.247"},
  {kind:"new",f:"Preterm baby (<37 weeks): what's added to thermal care?",b:"A thermal mattress and plastic bag wrap are mandatory.",src:"CPG 12.13 p.247"},
  {kind:"habit",f:"Clamp the cord straight away.",b:"Leave it intact for at least 60 seconds, then clamp about 5 cm from the umbilicus. Clamp at once only if resuscitation is needed.",src:"CPG 12.13 p.247"},
  {kind:"habit",f:"Suction meconium routinely before giving breaths.",b:"Suction only for obstruction, under direct vision. Mouth first, then nose.",src:"CPG 2.5 p.51"},
  {kind:"habit",f:"Judge the newborn's oxygenation by skin colour.",b:"Skin colour isn't accurate. Use breathing, heart rate, response to stimulation, tone and SpO₂.",src:"CPG 2.5 p.51"},
  {kind:"new",f:"The first breaths in newborn resuscitation?",b:"5 inflation breaths of 2–3 s with PEEP 6 cmH₂O. Room air at ≥32 weeks, 30% oxygen under 32 weeks.",src:"CPG 2.5 p.51"},
  {kind:"new",f:"When do newborn compressions start?",b:"HR still <60 after 30 s of ventilation. 3:1, two-thumb technique, 100% oxygen, reassess every 30 s.",src:"CPG 2.5 p.52"},
  {kind:"removed",f:"Glucagon for a hypoglycaemic newborn.",b:"Don't give glucagon. RBS <2.6 mmol/L in routine care: buccal glucose. In resuscitation: dextrose 10% 2 ml/kg.",src:"CPG 12.13 p.248 · CPG 2.5 p.52"}
 ],
 cardiac:[
  {kind:"new",f:"Adult medical shockable arrest: when is the first adrenaline?",b:"After the third shock, then every 4 minutes. Non-shockable: as soon as IV/IO is in.",src:"CPG 2.1 · Summary p.1"},
  {kind:"new",f:"Adult arrest: amiodarone timing?",b:"300 mg after the third shock, 150 mg after the fifth.",src:"CPG 2.1 · Summary p.1"},
  {kind:"new",f:"Zoll energy for adult arrest?",b:"150 J, 200 J, 200 J (LP15 unchanged: 200, 300, 360 J). Maximum 3 DSEDs.",src:"CPG 2.1 p.37 · Summary p.1"},
  {kind:"habit",f:"Use the adult medical drug timing in traumatic arrest.",b:"Trauma arrest: HOTT first, minimum scene time. Adrenaline only after reversible causes and at least 500 ml NS, then every 4 minutes.",src:"CPG 2.2 p.35"},
  {kind:"new",f:"How does paediatric CPR start?",b:"5 ventilations, then CPR at 15:2.",src:"CPG 2.3 · Summary p.2"},
  {kind:"new",f:"Child under 25 kg in arrest: pad position?",b:"Anterior-posterior is first choice. Over 25 kg, either position.",src:"CPG 2.3 p.42"},
  {kind:"habit",f:"Paediatric fluid bolus 20 ml/kg.",b:"10 ml/kg, up to 3 times in arrest. Dextrose 10% is now 2 ml/kg.",src:"CPG 2.3 p.43"},
  {kind:"habit",f:"Keep SpO₂ at 100% after ROSC.",b:"Target 94–98%. Avoid hyperoxaemia.",src:"CPG 2.6 p.54"},
  {kind:"new",f:"Comatose adult after a medical arrest with ROSC. Anything new?",b:"Ice packs to the axillae and groin. Don't let temperature drop below 33 °C, and tell the hospital.",src:"CPG 2.6 p.55"},
  {kind:"new",f:"Drowning arrest: first ventilation?",b:"Five ventilations with a BVM and 100% oxygen.",src:"CPG 2.8 p.58"},
  {kind:"habit",f:"\"Consider\" transporting a hypothermic arrest.",b:"Transport all of them unless there are signs of undeniable death, and consider e-CPR.",src:"CPG 2.8 p.58"},
  {kind:"habit",f:"It's 150 J for all synchronised cardioversion.",b:"150 J is broad-complex. Narrow-complex adult: 120 J regular, 200 J irregular. Cardioversion is CCP only; APs apply pads and escalate.",src:"CPG 4.3–4.4 pp.77, 79"},
  {kind:"habit",f:"Accept any handover from a CCP after an antiemetic.",b:"Only if the patient is stable, has no adverse effects, and has had no other CCP medications not approved for AP sign-off.",src:"CPG 6.4 · ondansetron formulary"}
 ],
 stroke:[
  {kind:"removed",f:"The 15-hour stroke time threshold.",b:"Removed. Use the ≤8 h, >8 to <24 h (with RACE), ≥24 h and unknown-onset branches.",src:"CPG 3.1 p.64"},
  {kind:"new",f:"Wake-up stroke with unknown onset. Where to?",b:"P1 to HGH ED with prenotification via CC:E.",src:"CPG 3.1 p.64"},
  {kind:"new",f:"Last known well 10 hours ago, RACE 6. Where to?",b:"P1 to HGH ED with prenotification via CC:E (RACE ≥5 in the >8 to <24 h window).",src:"CPG 3.1 p.64"},
  {kind:"new",f:"Last known well 10 hours ago, RACE 3. Where to?",b:"P2 to the nearest appropriate ED.",src:"CPG 3.1 p.64"},
  {kind:"new",f:"Last known well 24 hours ago or more. Where to?",b:"P2 to the nearest appropriate ED. No RACE needed for the decision.",src:"CPG 3.1 p.64"},
  {kind:"removed",f:"Penthrox for stroke-related pain.",b:"Removed. Paracetamol and an antiemetic if required; oxygen only as required.",src:"CPG 3.1 p.65 · Summary p.4"},
  {kind:"new",f:"What goes in a stroke prenotification?",b:"Age, last seen well, BEFAST, RACE if done, RBS, BP, anticoagulant status and ETA.",src:"CPG 3.1 p.62"}
 ]
};

/* ---------- Quick reference: one screen per module ---------- */
const REF={
 trauma:{visual:"txachart",items:[
  {t:"<b>Extrication:</b> self-extrication or minimal assistance is first line, including children who follow instructions, neck/back pain, soft neuro signs such as tingling that doesn't follow a nerve pathway (non-dermatomal tingling), and weakness or burning pain in the arms and hands, worse than in the legs (signs of central cord syndrome). Not if unable to follow instructions or stand on at least one leg. Hard neuro signs: rapid extrication, gentle handling.",scope:"AP",src:"CPG 10.13 p.200"},
  {t:"<b>U-STEP Out:</b> Understand · Support · Try moving · Egress · Plan · Out. Snatch rescue first if immediate threat to life or unconscious with absent/ineffective breathing.",scope:"AP",src:"CPG 10.13 p.201"},
  {t:"<b>While trapped:</b> minimal monitoring; only haemorrhage control, TXA if indicated and analgesia (Penthrox or ketamine). No MILS needed if conscious with no neuro deficit. Extrication buddy via Civil Defence.",scope:"AP",src:"CPG 10.13 pp.200–202"},
  {t:"<b>Paediatric TXA indications (AP &amp; CCP):</b> child under 14, major trauma under 3 hours, with suspected or confirmed major haemorrhage or isolated TBI with GCS ≤12.",scope:"AP",src:"HMCAS Paediatric IV TXA poster"},
  {t:"<b>TXA contraindications:</b> hypersensitivity to TXA · injury over 3 hours old · significant blood loss unlikely.",scope:"AP",src:"HMCAS Paediatric IV TXA poster"},
  {t:"<b>TXA dose:</b> 15 mg/kg using the chart weight (0–12 months: months × 0.5 + 4). At 10 mg/mL, volume (mL) = dose (mg) ÷ 10.",scope:"AP",src:"HMCAS Paediatric IV TXA poster"},
  {t:"<b>TXA preparation:</b> draw out 10 mL saline from the 100 mL bag → add 1 g (2 × 500 mg = 10 mL) → label immediately → mix gently → calculate the dose → cross-check the 5 Rights → draw out the calculated volume → give over 10 minutes → document the time.",scope:"AP",src:"HMCAS Paediatric IV TXA poster"},
  {t:"<b>≥8 years or &gt;30 kg:</b> draw out and discard the chart volume, then give the remaining volume over 10 minutes (includes 10 mL administration-set compensation).",scope:"AP",src:"HMCAS Paediatric IV TXA poster"},
  {t:"<b>Bag label must show:</b> drug name, correct dose, correct route, date and time. Cross-check everything before giving.",scope:"AP",src:"HMCAS Paediatric IV TXA poster"},
  {t:"<b>Obstetric TXA:</b> postpartum haemorrhage only. Removed from ectopic pregnancy, miscarriage, abruption and praevia.",scope:"AP",src:"CPG 12.1–12.4 · Circular rows 22–25, 29"},
  {t:"<b>Bypass:</b> abdominal seat belt sign is now a trauma bypass criterion.",scope:"AP",src:"CPG 10.10 · Circular row 19"},
  {t:"<b>Neurogenic shock MAP:</b> isolated 85–90 mmHg; with haemorrhagic shock ≥65 mmHg. Avoid hypotension; fluids judiciously.",scope:"AP",src:"CPG 10.3 p.178"},
  {t:"<b>Neurogenic shock treatment:</b> noradrenaline is preferred (adults); add adrenaline infusion if bradycardia and hypotension persist. Early intubation for C1–4 injury with airway/breathing compromise.",scope:"CCP",src:"CPG 10.3 pp.177–178"},
  {t:"<b>SMR:</b> consider removing the combi-carrier on the stretcher (keep for unconscious); head blocks always; stretcher up to 30° if lying flat causes distress; remove a rigid collar if causing distress.",scope:"AP",src:"CPG 10.3 p.178"}]},
 newborn:{visual:"ways",items:[
  {t:"<b>Normal ranges:</b> RR 40–60 · HR 100–160 · temperature 36–37.5 °C · flexed tone · centrally pink mucous membranes.",scope:"AP",src:"CPG 12.13 pp.246–247"},
  {t:"<b>Thermal care (mandatory):</b> warm room/ambulance, doors closed, AC off or lowest · dry thoroughly, especially the head · warm hat · wrap in blankets/thermal foil · keep ≥36.5 °C. Preterm &lt;37 weeks: thermal mattress and plastic bag wrap too.",scope:"AP",src:"CPG 12.13 p.247"},
  {t:"<b>Temperature checks:</b> soon after birth, during transport and on arrival; record in the ePCR.",scope:"AP",src:"CPG 12.13 p.248"},
  {t:"<b>Cord:</b> intact ≥60 s, then clamp ~5 cm from the umbilicus. Don't delay if resuscitation is needed.",scope:"AP",src:"CPG 12.13 p.247"},
  {t:"<b>Glucose:</b> routine care RBS &lt;2.6 mmol/L → pea-sized buccal glucose, repeat as required; no glucagon. Resuscitation → dextrose 10% 2 ml/kg.",scope:"AP",src:"CPG 12.13 p.249 · CPG 2.5 p.52"},
  {t:"<b>&lt;20 weeks:</b> not viable; resuscitation not required. False signs of life are possible. If in doubt, resuscitate.",scope:"AP",src:"CPG 12.13 p.247"},
  {t:"<b>Airway:</b> neutral head position; jaw thrust preferred; suction only for obstruction under direct vision (mouth then nose).",scope:"AP",src:"CPG 2.5 p.51"},
  {t:"<b>Breaths:</b> 5 inflation breaths of 2–3 s, ideally within 60 s, with PEEP 6 cmH₂O. ≥32 weeks room air; &lt;32 weeks 30% oxygen.",scope:"AP",src:"CPG 2.5 p.51"},
  {t:"<b>Compressions:</b> HR &lt;60 after 30 s of ventilation → 3:1, two-thumb, 100% oxygen; reassess HR and breathing every 30 s.",scope:"AP",src:"CPG 2.5 p.52"},
  {t:"<b>Targets:</b> SpO₂ &gt;80% and HR &gt;100 by 5 minutes; temperature 36.5–37.5 °C. Fluids NS 10 ml/kg (repeat once). Defib 4 J/kg, pads anterior-posterior.",scope:"AP",src:"CPG 2.5 p.52"}]},
 cardiac:{visual:"timeline",items:[
  {t:"<b>Adult medical shockable:</b> adrenaline after the 3rd shock, then every 4 minutes. Amiodarone 300 mg after the 3rd, 150 mg after the 5th. Non-shockable: adrenaline as soon as IV/IO is in.",scope:"AP",src:"CPG 2.1 · Summary p.1"},
  {t:"<b>Adult energy:</b> LP15 200, 300, 360 J · Zoll 150, 200, 200 J. Maximum 3 DSEDs, then standard anterior-posterior pads at maximum joules.",scope:"AP",src:"CPG 2.1 p.37 · Summary p.1"},
  {t:"<b>Adult CPR:</b> 100–120/min, 5–6 cm, pauses &lt;5 s; waveform capnography with any advanced airway, aim EtCO₂ ≈25 mmHg; gastric tube via SGA (APs and CCPs).",scope:"AP",src:"CPG 2.1–2.2 · Summary p.1"},
  {t:"<b>Adult trauma arrest:</b> HOTT first, minimum scene time. Adrenaline only after reversible causes and ≥500 ml NS, then every 4 minutes.",scope:"AP",src:"CPG 2.2 p.35"},
  {t:"<b>Paediatric arrest:</b> 5 ventilations, then 15:2. Adrenaline 0.01 mg/kg (max 1 mg): non-shockable ASAP; shockable after 4 min of CPR; every 4 min. Amiodarone 5 mg/kg after the 3rd (max 300 mg) and 5th (max 150 mg) shock. 4 J/kg.",scope:"AP",src:"CPG 2.3 pp.42–43"},
  {t:"<b>Paediatric details:</b> AP pads first choice &lt;25 kg · two-thumb for infants &lt;1 year · fluids 10 ml/kg × 3 · D10 2 ml/kg · ventilation &lt;1 y 25, 1–8 y 20, 8–12 y 15, &gt;12 y 10 per min. Trauma: adrenaline only after reversible causes and a 10 ml/kg NS bolus.",scope:"AP",src:"CPG 2.3–2.4 pp.43–47"},
  {t:"<b>Paediatric CCP:</b> energy escalation after 5 shocks in 2 J steps to max 8 J/kg; ETI may be considered after ~10 min; needle decompression (trauma) CCP only.",scope:"CCP",src:"CPG 2.3–2.4 · Summary p.2"},
  {t:"<b>Post-ROSC:</b> SpO₂ 94–98%, avoid hyperoxaemia. Adult SBP &gt;90 / MAP &gt;65. Comatose adult after medical arrest: ice packs to axillae and groin, not below 33 °C, tell the hospital.",scope:"AP",src:"CPG 2.6 pp.54–55"},
  {t:"<b>Special circumstances:</b> hypothermia: transport all without undeniable death; no adrenaline &lt;30 °C, every 6–10 min at 30–35 °C. Hyperthermia: cool to &lt;39 °C. Drowning: 5 BVM ventilations with 100% O₂. Dialysis: stop, return blood volume, disconnect before defib.",scope:"AP",src:"CPG 2.8 pp.58–59"},
  {t:"<b>Synchronised cardioversion (CCP only):</b> adult broad-complex 150 J; narrow-complex regular 120 J, irregular 200 J; escalate stepwise. Paediatric 1–2 J/kg, max 4 J/kg. AP: 12-lead, pads on, request CCP early.",scope:"CCP",src:"CPG 4.3–4.4 pp.77, 79"},
  {t:"<b>Antiemetic sign-off:</b> CCP may sign off to APs only if the patient is stable, has no adverse effects, and had no other CCP medications not approved for sign-off.",scope:"CCP",src:"CPG 6.4 · ondansetron formulary"}]},
 stroke:{visual:"tree",items:[
  {t:"<b>15-hour threshold:</b> removed.",scope:"AP",src:"CPG 3.1 p.64"},
  {t:"<b>RACE:</b> only for BEFAST-positive patients last known well &gt;8 and &lt;24 hours. Score 0–9; ≥5 suggests LVO.",scope:"AP",src:"CPG 3.1 pp.63–64"},
  {t:"<b>Prenotification:</b> age, last seen well, BEFAST, RACE if done, RBS, BP, anticoagulant status, ETA.",scope:"AP",src:"CPG 3.1 p.62"},
  {t:"<b>Management:</b> position appropriately; oxygen as required; paracetamol and antiemetic if required. Penthrox removed. Don't lower BP with nitrates.",scope:"AP",src:"CPG 3.1 pp.63, 65"},
  {t:"<b>CCP:</b> not needed unless haemodynamic or airway compromise. Don't wait on scene; meet the CCP en route.",scope:"AP",src:"CPG 3.1 p.63"},
  {t:"<b>RACE competence:</b> the circular's RACE video is required; accurate scoring still needs an observed check.",scope:"AP",src:"Circular p.2"}]}
};


/* ---------- Source documents (orientation + Reference tab) ---------- */
const DOCS=[
 {t:"CPG v2.6 2026 · full guideline",d:"Adobe Acrobat · online",href:"https://acrobat.adobe.com/id/urn:aaid:sc:AP:1963e713-622d-4f82-ae96-87aba78a5ac9"},
 {t:"List of changes v2.5 → v2.6",d:"Circular AS/SC 26-56 · PDF · available offline",href:"docs/CPG_v2.6_List_of_Changes_AS-SC-26-56.pdf"}
];
