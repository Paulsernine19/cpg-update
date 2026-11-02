COURSES.push(
 { id:"cardiac", title:"Cardiac Arrest", category:"Module 3", hue:"--c-cardiac", icon:"cardiac", minutes:40, requires:["intro"],
   desc:"Adult medical, adult trauma and paediatric arrest, ROSC, special circumstances, cardioversion and antiemetic handover.",
   coverage:"CPG 2.1–2.4, 2.6, 2.8, 2.9, 4.3, 4.4, 6.4 · newborn resuscitation is in Module 2",
   units:[
    {title:"Arrest algorithms", lessons:[
     {id:"ca-1", title:"Adult Medical Arrest", steps:[
      {type:"sort", label:"Adult medical · build the timeline", pop:"Adult medical arrest", scope:"AP", prompt:"Shockable rhythm. Place each milestone.", bins:["After shock 3","After shock 5","Every 4 minutes"],
       cards:[{t:"First adrenaline",b:0},{t:"Amiodarone 300 mg",b:0},{t:"Amiodarone 150 mg",b:1},{t:"Repeat adrenaline",b:2}],
       explain:"Adrenaline and amiodarone 300 mg after the third shock, amiodarone 150 mg after the fifth, then adrenaline every four minutes.", src:"CPG 2.1 · Summary p.1"},
      {type:"read", title:"Adult medical arrest timeline", pop:"Adult medical arrest", scope:"AP", visual:"timeline", body:"These milestones apply to <b>adult medical arrest only</b>. In <b>non-shockable</b> rhythms, give adrenaline <b>as soon as</b> IV/IO access is in, then every 4 minutes.",
       points:["<b>Energy:</b> LP15 200, 300, 360 J · Zoll 150, 200, 200 J","<b>DSED:</b> maximum 3, then standard anterior-posterior pads at maximum joules. Vector change: APs and CCPs","<b>CPR:</b> 100–120/min, 5–6 cm, full recoil, pauses &lt;5 s. If in doubt, assume arrest","<b>Airway:</b> waveform capnography with any advanced airway, aim EtCO₂ ≈25 mmHg; APs may now pass a gastric tube via the SGA","<b>CPR-induced consciousness:</b> no neuromuscular blockers (CCP: ketamine 1 mg/kg)","<span class='badge ccp'>CCP</span> may use the mechanical ventilator. Check e-CPR criteria (CPG 2.9) and update NCC"], src:"CPG 2.1 · Summary p.1"},
      {type:"walk", label:"Interactive algorithm", title:"Step through the drug milestones", pop:"Adult medical arrest", scope:"AP",
       case:"Adult medical cardiac arrest, shockable rhythm, high-quality CPR ongoing.", start:"a",
       nodes:{a:{q:"Shock 3 delivered. What is due now?",opts:[{t:"Adrenaline and amiodarone 300 mg",to:"b"},{t:"Adrenaline only",why:"Amiodarone 300 mg is also due after the third shock."},{t:"Nothing yet",why:"Adrenaline and amiodarone 300 mg are both due after the third shock."}]},
              b:{q:"Shock 5 delivered. Which amiodarone dose?",opts:[{t:"300 mg",why:"300 mg was the first dose. The dose after the fifth shock is 150 mg."},{t:"150 mg",to:"e"},{t:"No further amiodarone",why:"A second dose of 150 mg is given after the fifth shock."}]},
              e:{end:"Adrenaline continues every 4 minutes. These milestones apply to adult medical arrest only.",tone:"p1"}},
       src:"CPG 2.1 · Summary p.1"},
      {type:"choice", label:"Check", pop:"Adult medical arrest", scope:"AP", prompt:"You're using a Zoll. What are the three energy levels?",
       options:["120, 150, 200 J","150, 200, 200 J","200, 300, 360 J"], answer:1,
       fb:["That was the v2.5 Zoll sequence.",null,"That's the LP15 sequence."],
       explain:"Zoll: 150, 200, 200 J. LP15 is unchanged: 200, 300, 360 J.", src:"CPG 2.1 p.37"},
      {type:"choice", label:"Check", pop:"Adult medical arrest", scope:"AP", prompt:"Adult in PEA. IV access has just been secured. When is the first adrenaline?",
       options:["Now, as soon as possible","After the SGA cycle","After the third rhythm check"], answer:0,
       explain:"Non-shockable: adrenaline as soon as possible once IV/IO is in, then every 4 minutes.", src:"Summary p.1 · CPG 2.1"}
     ]},
     {id:"ca-2", title:"Adult Trauma Arrest", steps:[
      {type:"choice", label:"Case", pop:"Adult trauma arrest", scope:"AP", prompt:"An adult in traumatic cardiac arrest after a high-speed collision. Which approach fits v2.6?",
       options:["Apply the adult medical drug timing","Prioritise the HOTT causes, keep scene time to the minimum, and give adrenaline only after volume replacement","Delay all interventions until hospital"], answer:1,
       fb:["Adult medical timing must not be reused for trauma arrest.",null,"Trauma arrest priorities start on scene."],
       explain:"Trauma arrest has its own priorities and its own drug timing.", src:"CPG 2.2 p.35"},
      {type:"read", title:"Trauma arrest priorities", pop:"Adult trauma arrest", scope:"AP", body:"Treat the reversible traumatic causes first (<b>HOTT</b>: hypovolaemia, oxygenation, tension pneumothorax, tamponade) and keep scene time to a minimum.",
       points:["<b>No adrenaline</b> until reversible causes are managed and at least <b>500 ml normal saline</b> has been given","Then adrenaline every 4 minutes","Amiodarone as in medical arrest: 300 mg after the 3rd shock, 150 mg after the 5th","Gastric tube via SGA: APs and CCPs"], src:"CPG 2.2 p.35"},
      {type:"input", label:"Practice", pop:"Adult trauma arrest", scope:"AP", prompt:"Minimum volume of normal saline before the first adrenaline in adult trauma arrest?", answer:"500", unit:"ml", explain:"At least 500 ml normal saline, with reversible causes managed.", src:"CPG 2.2 p.35"}
     ]},
     {id:"ca-3", title:"Paediatric Arrest", steps:[
      {type:"choice", label:"Case", pop:"Paediatric arrest", scope:"AP", prompt:"An 18 kg child is in cardiac arrest. Which combination fits v2.6?",
       options:["Anterior-posterior pads, using the child's actual weight where known","Anterior-lateral pads, estimating weight from age even when actual weight is known","Any pad position, estimating weight from age"], answer:0,
       explain:"Under 25 kg, anterior-posterior is first choice. Use the actual weight from parents or caregivers; use an age-based formula only if it isn't available.", src:"CPG 2.3 pp.42–43"},
      {type:"read", title:"Paediatric changes", pop:"Paediatric arrest", scope:"AP", body:"Start CPR for no signs of life, or for HR <b>&lt;60 with poor perfusion</b> (pallor, mottling, central cyanosis).",
       points:["<b>5 ventilations</b>, then CPR at <b>15:2</b>","Depth at least one-third of the chest (5–6 cm adolescents), 100–120/min; <b>two-thumb encircling</b> for infants &lt;1 year","Adrenaline <b>0.01 mg/kg</b> (max 1 mg; 0.1 ml/kg of 1:10,000): non-shockable as soon as possible; shockable <b>after 4 minutes of CPR</b>; then every 4 minutes","Amiodarone <b>5 mg/kg</b> after the 3rd shock (max 300 mg) and after the 5th (max 150 mg)","Energy <b>4 J/kg</b>. Fluids <b>10 ml/kg × 3</b>. Dextrose 10% <b>2 ml/kg</b>","Ventilation rate with an advanced airway: &lt;1 y 25 · 1–8 y 20 · 8–12 y 15 · &gt;12 y 10 per minute","<b>Trauma (CPG 2.4):</b> no adrenaline until reversible causes and a 10 ml/kg NS bolus; outcome is continue and transport","<span class='badge ccp'>CCP</span> escalate after 5 shocks in 2 J steps to max 8 J/kg; may consider ETI after ~10 min; needle decompression CCP only"], src:"CPG 2.3–2.4 pp.42–49 · Summary p.2"},
      {type:"input", label:"Practice", pop:"Paediatric arrest", scope:"AP", prompt:"The 18 kg child is in asystole. What adrenaline dose do you give?", answer:"0.18", unit:"mg", explain:"0.01 mg/kg × 18 kg = 0.18 mg (1.8 ml of 1:10,000), as soon as possible, then every 4 minutes.", src:"CPG 2.3 p.43"},
      {type:"input", label:"Practice", pop:"Paediatric arrest", scope:"AP", prompt:"Same child: what fluid bolus volume?", answer:"180", unit:"ml", explain:"10 ml/kg × 18 kg = 180 ml, up to 3 times.", src:"CPG 2.3 p.43"},
      {type:"choice", label:"Check", pop:"Paediatric arrest", scope:"AP", prompt:"A child in VF. When is the first adrenaline?",
       options:["After the 2nd shock","After 4 minutes of CPR","Never in shockable rhythms"], answer:1,
       fb:["That was the v2.5 flowchart.",null,"Adrenaline is given in shockable rhythms too."],
       explain:"Shockable: first adrenaline after 4 minutes of CPR, 0.01 mg/kg (max 1 mg), then every 4 minutes.", src:"CPG 2.3 p.43"},
      {type:"choice", label:"Check", pop:"Paediatric arrest", scope:"AP", prompt:"A 5-year-old with an SGA in place. Ventilation rate during continuous compressions?",
       options:["10 per minute","20 per minute","25 per minute"], answer:1,
       explain:"1–8 years: 20 breaths/min. If the SGA leaks with continuous compressions, revert to 15:2.", src:"CPG 2.3 p.45"}
     ]}
    ]},
    {title:"ROSC and special settings", lessons:[
     {id:"ca-4", title:"After ROSC", steps:[
      {type:"choice", label:"Case", scope:"AP", prompt:"After ROSC, the patient's SpO₂ reads 100% on high-flow oxygen. What do you do?",
       options:["Titrate oxygen down to a target of 94–98%","Keep SpO₂ at 100% throughout transport","Remove all oxygen"], answer:0,
       explain:"The post-ROSC SpO₂ target is 94–98%. Avoid hyperoxaemia.", src:"CPG 2.6 p.54"},
      {type:"read", title:"Post-ROSC care", scope:"AP", body:"Support ABC, maintain cerebral perfusion and manage arrhythmias.",
       points:["SpO₂ <b>94–98%</b>; don't hyperventilate; don't try to normalise a raised EtCO₂","12-lead ECG after a medical arrest; STEMI → PCI-capable facility","Adult SBP &gt;90 or MAP &gt;65 (MAP 70–80 for isolated TBI); 250 ml boluses. Paediatric SBP (age × 2) + 70, <b>10 ml/kg</b> boluses","Correct RBS &lt;4.0: adults D10 50 ml; children 2 ml/kg (max 50 ml)","Avoid rapid movement for up to 10 minutes after ROSC","<b>Cooling (new):</b> comatose <b>adult</b> after a <b>medical</b> arrest: ice packs to the axillae and groin. Don't let temperature drop <b>below 33 °C</b>, and tell the hospital"], src:"CPG 2.6 pp.54–56"},
      {type:"sort", label:"Cooling", scope:"AP", prompt:"Ice-pack cooling after ROSC?", bins:["Start ice packs","No cooling"],
       cards:[{t:"Adult, medical arrest, GCS 3 after ROSC",b:0},{t:"Adult, medical arrest, now awake and talking",b:1},{t:"Adult, temperature already 32.8 °C",b:1},{t:"8-year-old, comatose after ROSC",b:1}],
       explain:"Cooling is for comatose adults after a medical arrest, and temperature must not fall below 33 °C. In all patients, avoid hyperthermia.", src:"CPG 2.6 p.55"}
     ]},
     {id:"ca-5", title:"Special Circumstances", steps:[
      {type:"choice", label:"Case", scope:"AP", prompt:"An adult is pulled from a swimming pool in cardiac arrest. How does ventilation start?",
       options:["Five ventilations with a BVM and 100% oxygen","Compressions only, with no ventilations until hospital","Adult medical drug timing is the only change"], answer:0,
       explain:"Drowning: 5 ventilations with BVM and 100% oxygen, then standard management. Consider spinal injury (SMR mustn't delay resuscitation), hypothermia and e-CPR.", src:"CPG 2.8 p.58"},
      {type:"read", title:"Other special circumstances", scope:"AP", body:"CPG 2.8 updates these arrest situations:",
       points:["<b>Hypothermia:</b> after 3 shocks, delay further shocks until core temp &gt;30 °C; withhold adrenaline &lt;30 °C; at 30–35 °C give adrenaline every <b>6–10 minutes</b>. PEA &lt;30 °C: feel for a pulse ≥60 s and check EtCO₂. <b>Transport all</b> without signs of undeniable death; consider e-CPR","<b>Hyperthermia</b> (&gt;39 °C, e.g. heat stroke): cool environment, remove clothing, ice packs, water spray. Aim for &lt;39 °C","<b>During dialysis:</b> stop dialysis, return the blood volume with a fluid bolus, disconnect before defibrillating unless the machine is defib-proof; the dialysis access can be used for drugs","<b>Hyperkalaemia</b> is likely in renal patients with no obvious cause: calcium chloride 10% 10 ml"], src:"CPG 2.8 pp.58–59"},
      {type:"sort", label:"Match the circumstance", scope:"AP", prompt:"Which arrest does each action belong to?", bins:["Hypothermia","Hyperthermia","Dialysis"],
       cards:[{t:"Withhold adrenaline below 30 °C",b:0},{t:"Adrenaline every 6–10 min at 30–35 °C",b:0},{t:"Transport all without signs of undeniable death",b:0},{t:"Cool to below 39 °C",b:1},{t:"Ice packs, remove clothing, water spray",b:1},{t:"Return blood volume with a fluid bolus",b:2},{t:"Disconnect before defibrillating",b:2}],
       explain:"Each special circumstance changes the standard algorithm in a specific way.", src:"CPG 2.8 p.58"},
      {type:"multi", label:"e-CPR", scope:"AP", prompt:"Which are e-CPR inclusion criteria?", options:["Medical cardiac arrest","Age under 60","Witnessed, with immediate CPR","Initial rhythm VF, VT or PEA","Arrest to ED ≤45 minutes","EtCO₂ >10 mmHg","Initial rhythm asystole","On haemodialysis"], answer:[0,1,2,3,4,5],
       explain:"All criteria must be met, with no significant comorbidities (e.g. renal failure on haemodialysis, active cancer, CHF, COPD, bed-bound, dementia).", src:"CPG 2.9 p.60"}
     ]}
    ]},
    {title:"Code clock: hands-on", lessons:[
     {id:"cc-1", title:"The Arrest Call", scene:"code", steps:[{type:"stage",stage:"ccintro"},{type:"stage",stage:"cckit"}]},
     {id:"cc-2", title:"Pads On", scene:"code", steps:[{type:"stage",stage:"ccpads"}]},
     {id:"cc-3", title:"Adult Medical Arrest", scene:"code", steps:[{type:"stage",stage:"ccloop"}]},
     {id:"cc-4", title:"Adult Trauma Arrest", scene:"code", steps:[{type:"stage",stage:"ccloop",variant:"trauma"}]},
     {id:"cc-5", title:"Paediatric Arrest", scene:"code", steps:[{type:"stage",stage:"ccpads",variant:"paed"},{type:"stage",stage:"ccloop",variant:"paed"}]},
     {id:"cc-6", title:"After ROSC", scene:"code", steps:[{type:"stage",stage:"ccrosc"},{type:"stage",stage:"ccice"}]},
     {id:"cc-7", title:"Solo Run", scene:"code", rxRun:"code", steps:[{type:"stage",stage:"ccpads"},{type:"stage",stage:"ccloop"},{type:"stage",stage:"ccrosc"},{type:"stage",stage:"ccice"}]}
    ]},
    {title:"Related updates", lessons:[
     {id:"ca-6", title:"Cardioversion & Antiemetics", steps:[
      {type:"read", title:"Who cardioverts?", scope:"CCP", body:"Synchronised cardioversion is <b>CCP scope of practice only</b>. Your role as an AP is to recognise a life-threatening tachycardia, get a 12-lead ECG, apply the pads and request a CCP early. Know the energies so you can anticipate and support.", src:"HMCAS scope of practice · CPG 4.3–4.4"},
      {type:"choice", label:"Check", scope:"CCP", prompt:"A colleague says: \"It's 150 J for all synchronised cardioversion now.\" Is that right?",
       options:["Yes, for both broad- and narrow-complex","No. 150 J is broad-complex; narrow-complex is 120 J regular, 200 J irregular","No, it's unchanged from v2.5"], answer:1,
       explain:"Adult broad-complex: 150 J (was 200 J). Adult narrow-complex: 120 J if regular, 200 J if irregular. Escalate stepwise if the first shock fails.", src:"CPG 4.3 p.77 · CPG 4.4 p.79"},
      {type:"sort", label:"Anticipate the energy", scope:"CCP", prompt:"Adult, life-threatening compromise. Which first energy will the CCP select?", bins:["120 J","150 J","200 J"],
       cards:[{t:"Regular narrow-complex (SVT)",b:0},{t:"Broad-complex tachycardia",b:1},{t:"Irregular narrow-complex (AF)",b:2}],
       explain:"Broad 150 J · narrow regular 120 J · narrow irregular 200 J. Paediatric: 1–2 J/kg, escalating to max 4 J/kg.", src:"CPG 4.3–4.4"},
      {type:"read", title:"Sign-off after an antiemetic", scope:"CCP", body:"A CCP may give an antiemetic and sign the patient off to the AP crew for transport <b>only if all</b> of these are true:",
       points:["The patient is stable","There are no adverse effects","No other CCP medications have been given that aren't approved for sign-off to APs","Remember: antiemetics aren't routine; prophylaxis only for long transfers where motion sickness could be harmful (ondansetron doesn't treat motion sickness)"], src:"CPG 6.4 · ondansetron formulary"},
      {type:"choice", label:"Case", scope:"AP", prompt:"Your patient is in a broad-complex tachycardia, hypotensive and confused. No CCP is on scene. What do you do?",
       options:["Cardiovert at 150 J yourself","12-lead ECG, apply pads, request a CCP urgently and be ready to manage arrest","Wait for the hospital to cardiovert"], answer:1,
       fb:["Synchronised cardioversion is CCP scope only.",null,"A life-threatening tachycardia needs a CCP now, not at hospital. Request early and prepare for arrest."],
       explain:"Recognise, prepare and escalate. Pads on means the CCP can shock straight away, and you're ready if the patient goes pulseless.", src:"HMCAS scope of practice · CPG 4.3"},
      {type:"choice", label:"Case", scope:"CCP", prompt:"A CCP gave ondansetron and ketamine analgesia and wants to sign off to you. The patient is stable. Do you accept?",
       options:["Yes, the patient is stable","Not unless ketamine is approved for AP sign-off; otherwise the CCP continues care","Yes, antiemetic sign-off covers every drug"], answer:1,
       explain:"Sign-off after an antiemetic needs all three conditions, including no other CCP medications not approved for sign-off.", src:"CPG 6.4"}
     ]}
    ]},
    {title:"Module check", lessons:[{id:"ca-x", title:"Cardiac Check", mode:"exit", bank:"cardiac"}]}
   ]},

);
