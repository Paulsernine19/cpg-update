COURSES.push(
 { id:"newborn", title:"Newborn Care & Resuscitation", category:"Module 2", hue:"--c-newborn", icon:"newborn", minutes:45, requires:["intro"],
   desc:"New routine care of the newborn (CPG 12.13) with hands-on thermal care, and revised newborn resuscitation (CPG 2.5).",
   coverage:"New CPG 12.13 · revised CPG 2.5",
   units:[
    {title:"Two pathways", lessons:[
     {id:"nb-1", title:"Two Newborns", steps:[
      {type:"choice", label:"Case", scope:"AP", prompt:"Two births on the same shift. Baby A is term, crying and breathing well. Baby B is preterm and not breathing effectively. Which pathway applies to Baby B?",
       options:["Routine newborn care (CPG 12.13)","Newborn resuscitation (CPG 2.5)","Adult cardiac arrest"], answer:1,
       fb:["Routine care (CPG 12.13) is for babies breathing well, with no resuscitation needed.",null,"Newborns follow the newborn pathways, not the adult arrest algorithm."],
       explain:"A baby who is not breathing effectively follows the newborn resuscitation pathway.", src:"CPG 12.13 p.245 · CPG 2.5"},
      {type:"choice", label:"Case", scope:"AP", prompt:"And Baby A?", options:["Routine newborn care (CPG 12.13)","Newborn resuscitation (CPG 2.5)"], answer:0,
       fb:[null,"Baby A is term and breathing well, so no resuscitation is needed."],
       explain:"A breathing term baby follows the new routine care guideline, CPG 12.13.", src:"CPG 12.13 · Circular row 26"},
      {type:"read", title:"Keep the pathways separate", visual:"ways", body:"v2.6 adds a new routine care guideline and revises resuscitation. Decide which pathway applies first, then set your thermal and ventilation priorities. Before the birth: take the obstetric history (including gestation), prepare resuscitation equipment and a plan, and warm the environment.", src:"CPG 12.13 pp.248–249"},
      {type:"walk", label:"Interactive algorithm", title:"Work through Baby B", scope:"AP",
       case:"Baby B: born at 30 weeks, not breathing effectively. Meconium-stained liquor. You can't see any obstruction.", start:"a",
       nodes:{a:{q:"Is the baby breathing effectively?",opts:[{t:"Yes",why:"Baby B is not breathing effectively, so this is the resuscitation pathway."},{t:"No",to:"b"}]},
              b:{q:"Cord clamped and cut, baby dried and warm, head neutral, jaw thrust. Is there obstruction seen under direct vision?",opts:[{t:"Yes",why:"No obstruction is visible in this case."},{t:"No",to:"c"}]},
              c:{q:"What comes next?",opts:[{t:"Routine suction because of the meconium",why:"Suction is only for obstruction seen under direct vision. The meconium indication was removed."},{t:"Five inflation breaths of 2–3 s with PEEP 6",to:"d"},{t:"Start chest compressions at a 3:1 ratio",why:"Ventilation comes first. Compressions start only if HR stays <60 after 30 s of ventilation."}]},
              d:{q:"Baby B is 30 weeks. Which oxygen for the inflation breaths?",opts:[{t:"Room air (21%)",why:"Room air is for 32 weeks or more."},{t:"30% oxygen",to:"e"},{t:"100% oxygen",why:"100% is for when compressions are needed."}]},
              e:{end:"Check for chest rise and reassess heart rate. If HR stays below 60 after 30 seconds of ventilation, start compressions at 3:1 with 100% oxygen.",tone:"p1"}},
       src:"CPG 2.5 pp.51–52"}
     ]},
     {id:"nb-2", title:"Thermal Care & Risks", steps:[
      {type:"read", title:"Normal newborn observations", scope:"AP", body:"CPG 12.13 gives these normal ranges:",
       points:["<b>Respiratory rate</b> 40–60/min, counted over 1 minute. Irregular, abdominal breathing is normal","<b>Heart rate</b> 100–160/min, auscultated for 1 minute; use SpO₂ and ECG monitoring too","<b>Temperature</b> 36–37.5 °C","<b>Tone</b> flexed. A floppy baby needs urgent care","<b>Colour</b> centrally pink mucous membranes. Skin tone can differ for the first few minutes"], src:"CPG 12.13 pp.246–247"},
      {type:"read", title:"Thermal care is mandatory", scope:"AP", body:"Keep the newborn's temperature <b>at or above 36.5 °C</b> throughout care and transport.",
       points:["Warm the room or ambulance: doors and windows closed, AC off or on its lowest setting. Ideally move to the ambulance","Dry thoroughly, especially the head","Warm hat (the beanie in the obstetric kit)","Wrap in blankets or towels and thermal foil wrap","<b>Preterm (&lt;37 weeks):</b> thermal mattress and plastic bag wrap are also mandatory","Skin-to-skin is optional: only if mother and baby are well and warm and you can monitor airway and breathing","Measure temperature soon after birth, during transport and on arrival; record it in the ePCR"], src:"CPG 12.13 pp.247–248"},
      {type:"choice", label:"Check", scope:"AP", prompt:"A baby is born at 35 weeks and is breathing well. Which thermal care is mandatory?",
       options:["Dry, hat and wrap only, because the baby is well","Dry, hat, wrap, thermal mattress and plastic bag wrap","Skin-to-skin contact instead of a hat and wrap"], answer:1,
       fb:["Under 37 weeks is preterm: the thermal mattress and plastic bag wrap are mandatory even when the baby is well.",null,"Drying, a warm hat and wrapping are all mandatory, plus the thermal mattress and plastic bag wrap under 37 weeks."],
       explain:"Under 37 weeks is preterm, so the thermal mattress and plastic bag wrap are mandatory on top of drying, a hat and wrapping.", src:"CPG 12.13 p.247"},
      {type:"multi", label:"Risks", scope:"AP", prompt:"Which newborns are at risk of hypoglycaemia?",
       options:["Preterm (<37 weeks)","Birth weight <2.5 kg","Needed resuscitation at birth","Mother has diabetes","Hypothermic","Term baby, 3.4 kg, crying, warm, mother well"], answer:[0,1,2,3,4],
       explain:"Risk factors also include small for gestational age, a mother on beta-blockers, perinatal hypoxia and infection or sepsis. Good thermal care helps prevent hypoglycaemia.", src:"CPG 12.13 pp.245, 248"},
      {type:"read", title:"Other risks to look for", scope:"AP", body:"Assess for the newborn's main clinical risks:",
       points:["<b>Hypoxia:</b> cord compression or prolapse, placental or cord bleeding; meconium may indicate perinatal hypoxia","<b>Sepsis:</b> maternal antibiotics for infection, GBS this pregnancy or a previous GBS baby, preterm pre-labour rupture, membranes ruptured &gt;18 hours","<b>Jaundice risk:</b> &lt;38 weeks, siblings with neonatal jaundice, bruising from instrumental or caesarean birth, diabetic mother","<b>Exposed organs:</b> cover with cling film, but never wrap it all the way around","Prenotify the receiving obstetric unit if the baby has complications or is being resuscitated"], src:"CPG 12.13 pp.245–248"}
     ]}
    ]},
    {title:"Thermal care: hands-on", lessons:[
     {id:"th-v", title:"Watch: Thermal Care", steps:[{type:"watch",title:"Keeping the newborn warm",scope:"AP",body:"Watch this video before the hands-on thermal care practice.",src:null}]},
     {id:"th-1", title:"The Birth", scene:"thermo", steps:[{type:"stage",stage:"thintro"},{type:"stage",stage:"th",key:"dry"}]},
     {id:"th-2", title:"Cap & Wrap", scene:"thermo", steps:[{type:"stage",stage:"th",key:"cap"},{type:"stage",stage:"th",key:"towel"},{type:"stage",stage:"th",key:"thermal"}]},
     {id:"th-3", title:"First Temperature Check", scene:"thermo", steps:[{type:"stage",stage:"th",key:"temp1"}]},
     {id:"th-4", title:"Warm the Room", scene:"thermo", steps:[{type:"stage",stage:"th",key:"ac"},{type:"stage",stage:"th",key:"door"}]},
     {id:"th-5", title:"Reassess & Monitor", scene:"thermo", steps:[{type:"stage",stage:"th",key:"temp2"}]},
     {id:"th-6", title:"Solo Round", scene:"thermo", thRun:true, steps:[{type:"stage",stage:"th",key:"dry"},{type:"stage",stage:"th",key:"cap"},{type:"stage",stage:"th",key:"towel"},{type:"stage",stage:"th",key:"thermal"},{type:"stage",stage:"th",key:"temp1"},{type:"stage",stage:"th",key:"ac"},{type:"stage",stage:"th",key:"door"},{type:"stage",stage:"th",key:"temp2"}]}
    ]},
    {title:"Resuscitation", lessons:[
     {id:"nb-3", title:"Initial Breaths", steps:[
      {type:"read", title:"Assess, then open the airway", scope:"AP", body:"Assess immediately after birth: <b>breathing</b>, <b>heart rate</b>, <b>response to tactile stimulation</b> and <b>tone</b>. Skin colour is no longer used to judge oxygenation.",
       points:["Breathing: regular is satisfactory; slow, gasping or grunting may need intervention; absent needs intervention","Heart rate: &gt;100 satisfactory; 60–100 may need intervention; &lt;60 needs intervention","Stimulate gently by drying or rubbing the soles or back. Never vigorously","Head neutral (pad under the shoulders if needed); <b>jaw thrust</b> preferred","Suction <b>only</b> for obstruction, under direct vision: mouth, then nose","OPA if BVM ventilation is expected to be difficult; SGA if BVM is ineffective, apnoea persists, or prolonged ventilation and compressions are needed"], src:"CPG 2.5 pp.50–51"},
      {type:"read", title:"Five inflation breaths", scope:"AP", body:"For an apnoeic, gasping or ineffectively breathing newborn, start positive pressure ventilation, ideally within 60 seconds of birth.",
       points:["<b>5 inflation breaths</b>, each with an inflation time of <b>2–3 seconds</b>","Attach a <b>PEEP valve</b> to the BVM: <b>6 cmH₂O</b>","<b>≥32 weeks:</b> room air (21%)","<b>&lt;32 weeks:</b> 30% oxygen","Look for chest rise. If none: open the airway, reposition, check the volume","A rising HR or a stable HR &gt;100 means ventilation is working"], src:"CPG 2.5 p.51"},
      {type:"choice", label:"Case", scope:"AP", prompt:"The liquor is meconium-stained and the baby is not breathing. You cannot see any obstruction. What do you do about suction?",
       options:["Suction routinely before giving breaths","Don't suction; start five inflation breaths","Suction until the liquor runs clear"], answer:1,
       fb:["Suction is used only for obstruction seen under direct vision.",null,"Prolonged suction delays ventilation. Suction only for visible obstruction."],
       explain:"With no visible obstruction, move straight on to the five inflation breaths.", src:"CPG 2.5 p.51"},
      {type:"choice", label:"Case", scope:"AP", prompt:"A baby born at 38 weeks is apnoeic. Which settings do you use for the inflation breaths?",
       options:["Room air with PEEP 6 cmH₂O","30% oxygen with PEEP 6 cmH₂O","100% oxygen with no PEEP"], answer:0,
       fb:[null,"30% oxygen is for babies under 32 weeks. At 38 weeks use room air.","Start in room air (21%) at 32 weeks or more, and always attach PEEP 6 cmH₂O."],
       explain:"At 32 weeks or more, ventilate with room air (21%) and PEEP 6 cmH₂O.", src:"CPG 2.5 p.51"},
      {type:"input", label:"Practice", scope:"AP", prompt:"How long should each inflation breath last, at most?", answer:"3", unit:"seconds", explain:"Each of the 5 inflation breaths has an inflation time of 2–3 seconds.", src:"CPG 2.5 p.51"}
     ]},
     {id:"nb-4", title:"Further Care", steps:[
      {type:"read", title:"If the heart rate stays low", scope:"AP", body:"Bradycardia in the newborn is usually due to hypoxia, so effective ventilation comes first.",
       points:["Start compressions if HR stays <b>&lt;60 after 30 seconds</b> of BVM ventilation","Increase oxygen to <b>100%</b>; prepare an SGA and IV/IO access","Ratio <b>3:1</b>, and keep 3:1 once an SGA is in","<b>Two-thumb encircling</b> technique","Reassess HR and breathing <b>every 30 seconds</b>","Once breathing adequately with HR &gt;100: stop ventilations and titrate oxygen down"], src:"CPG 2.5 p.52"},
      {type:"scrub", scrub:"newborn", label:"Explore", scope:"AP"},
      {type:"walk", label:"Interactive algorithm", title:"Reassess and branch", scope:"AP",
       case:"Term baby, apnoeic. You've given 5 inflation breaths with PEEP 6 in room air and are ventilating with good chest rise.", start:"a",
       nodes:{a:{q:"After 30 seconds of ventilation, HR is 50. What now?",opts:[{t:"Keep ventilating and recheck in 2 minutes",why:"HR <60 after 30 s of ventilation is the compression trigger."},{t:"Compressions 3:1, two-thumb, oxygen up to 100%",to:"b"},{t:"Compressions 15:2, two-thumb, oxygen unchanged",why:"Newborn ratio is 3:1."}]},
              b:{q:"When do you next check HR and breathing?",opts:[{t:"In 30 seconds",to:"c"},{t:"In 2 minutes",why:"Reassess every 30 seconds."}]},
              c:{q:"HR is now 120 and the baby is breathing on their own. What next?",opts:[{t:"Stop ventilations and titrate oxygen to target",to:"e"},{t:"Continue compressions for 2 more minutes",why:"HR >100 with adequate breathing: stop compressions and ventilations."}]},
              e:{end:"Aim for SpO₂ >80% and HR >100 by 5 minutes. Keep temperature 36.5–37.5 °C.",tone:"p1"}},
       src:"CPG 2.5 p.52"},
      {type:"read", title:"Targets and other care", scope:"AP", body:"Expected preductal SpO₂ rises over the first 10 minutes:",
       points:["1 min 60–65% · 2 min 65–70% · 3 min 70–75% · 4 min 75–80% · 5 min 80–85% · 10 min 85–95%","Avoid SpO₂ &lt;80% or bradycardia at 5 minutes","Fluids: normal saline <b>10 ml/kg</b> IV/IO, may be repeated once","Still poorly responsive despite good ventilation, perfusion and temperature: check RBS from the lateral heel; if low, dextrose 10% <b>2 ml/kg</b>","Shockable rhythm is very rare: <b>4 J/kg</b>, pads anterior-posterior","Parents may stay; assign a paramedic to support them if resources allow"], src:"CPG 2.5 pp.51–52"},
      {type:"choice", label:"Check", scope:"AP", prompt:"At 3 minutes after birth the baby's SpO₂ is 72% and HR is 130. What do you make of this?",
       options:["Within the expected range for 3 minutes","Hypoxic: start compressions straight away","Increase to 100% oxygen immediately"], answer:0,
       fb:[null,"HR 130 is satisfactory, and SpO₂ 70–75% is expected at 3 minutes. Compressions start only if HR stays below 60 after 30 seconds of ventilation.","SpO₂ 70–75% is expected at 3 minutes. The target is above 80% by 5 minutes."],
       explain:"At 3 minutes the expected SpO₂ is 70–75%. Aim for >80% by 5 minutes.", src:"CPG 2.5 p.51 · CPG 12.13 p.249"}
     ]},
     {id:"nb-5", title:"Glucose & Cord", steps:[
      {type:"sort", label:"Match the context", scope:"AP", prompt:"Match each glucose treatment to its context.", bins:["Routine newborn care","Newborn resuscitation"],
       cards:[{t:"Pea-sized buccal glucose, repeat as required",b:0},{t:"Dextrose 10% 2 ml/kg IV/IO",b:1},{t:"Treat if RBS <2.6 mmol/L",b:0},{t:"Check RBS if responsiveness stays poor despite good ventilation",b:1}],
       explain:"Routine care: RBS <2.6 mmol/L → buccal glucose; IV dextrose is generally not needed. Resuscitation: dextrose 10% 2 ml/kg if hypoglycaemic. Never glucagon.", src:"CPG 12.13 pp.248–249 · CPG 2.5 p.52"},
      {type:"choice", label:"Check", scope:"AP", prompt:"A colleague suggests IM glucagon for a hypoglycaemic newborn. What do you say?",
       options:["Fine, IM is the fastest route for a newborn","No. It should not be given; use buccal glucose","Only if the RBS is very low and buccal glucose fails"], answer:1,
       fb:["Glucagon should not be given to a newborn. Use pea-sized buccal glucose.",null,"Glucagon is not given to newborns at any glucose level. Repeat buccal glucose as required."],
       explain:"Glucagon should not be administered to the newborn. Early breastfeeding can help prevent hypoglycaemia, but not if it risks hypothermia.", src:"CPG 12.13 p.248"},
      {type:"read", title:"The umbilical cord", scope:"AP", body:"For a well baby, leave the cord intact for <b>at least 60 seconds</b> after birth (it turns white), then clamp and cut about <b>5 cm</b> from the umbilicus.",
       points:["If resuscitation or urgent intervention is needed, <b>don't delay</b>: clamp, cut and move to a dry, warm area","If the cord has snapped, watch for hypovolaemia: pale mucous membranes, respiratory distress"], src:"CPG 12.13 p.247 · CPG 2.5 p.52"},
      {type:"choice", label:"Case", scope:"AP", prompt:"A newborn is floppy and apnoeic at birth. When do you clamp the cord?",
       options:["Wait the full 60 seconds, then clamp and cut","Clamp and cut now, then start resuscitation","Leave it uncut until you reach hospital"], answer:1,
       fb:["Delayed clamping is for well babies. Don't delay resuscitation to wait 60 seconds.",null,"If resuscitation is needed, clamp and cut straight away so it can start."],
       explain:"Delayed clamping is for well babies. If urgent resuscitation is needed, clamp and cut straight away.", src:"CPG 2.5 p.52"},
      {type:"read", title:"Very early births", scope:"AP", body:"This is one of the hardest situations you'll attend. CPG 12.13 and 2.5 give clear guidance:",
       points:["Babies born <b>under 20 weeks</b> are not viable and resuscitation is not required","They may show brief reflex activity (gasps, chest wall pulsation, twitches), usually in the first minute. These are not signs of viable life","Explain gently to the parents that the baby has been born too early to survive, and that they may see these movements","Wrap the baby and offer the parents the chance to hold them","Over 20 weeks, or gestation unknown with signs of life: resuscitate per CPG 2.5","<b>If in doubt, resuscitate.</b> Once started prehospitally, resuscitation is not stopped"], src:"CPG 12.13 pp.247–248 · CPG 2.5 p.52"},
      {type:"choice", label:"Check", scope:"AP", prompt:"The mother isn't sure of her dates. The baby is small and gasping. What do you do?",
       options:["Withhold resuscitation, as the baby looks very premature","Begin resuscitation, as there are signs of life","Wait a minute to see if the gasps continue"], answer:1,
       fb:["With unknown gestation and signs of life, start resuscitation. If in doubt, resuscitate.",null,"Gasping is a sign of life. Start resuscitation without waiting."],
       explain:"If gestation is unknown and there are signs of life, or if in any doubt, start resuscitation.", src:"CPG 12.13 p.247"}
     ]}
    ]},
    {title:"Newborn resuscitation: hands-on", lessons:[
     {id:"nr-1", title:"Kit, Cord & Airway", scene:"nbr", steps:[{type:"stage",stage:"nrintro"},{type:"stage",stage:"nrkit"},{type:"stage",stage:"nrcord"}]},
     {id:"nr-2", title:"Set Up the BVM", scene:"nbr", steps:[{type:"stage",stage:"nrset"}]},
     {id:"nr-3", title:"Inflation Breaths", scene:"nbr", steps:[{type:"stage",stage:"nrbreath"}]},
     {id:"nr-4", title:"Heart Rate & Compressions", scene:"nbr", steps:[{type:"stage",stage:"nrhr"},{type:"stage",stage:"nrcomp"}]},
     {id:"nr-5", title:"Targets & Glucose", scene:"nbr", steps:[{type:"stage",stage:"nrmon"},{type:"stage",stage:"nrglu"}]},
     {id:"nr-6", title:"Solo Run", scene:"nbr", rxRun:"nbr", steps:[{type:"stage",stage:"nrkit"},{type:"stage",stage:"nrcord"},{type:"stage",stage:"nrset"},{type:"stage",stage:"nrbreath"},{type:"stage",stage:"nrhr"},{type:"stage",stage:"nrcomp"},{type:"stage",stage:"nrmon"},{type:"stage",stage:"nrglu"}]}
    ]},
    {title:"Module check", lessons:[{id:"nb-x", title:"Newborn Check", mode:"exit", bank:"newborn"}]}
   ]},

);
