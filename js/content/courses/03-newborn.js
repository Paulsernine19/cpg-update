COURSES.push(
 { id:"newborn", title:"Newborn Care & Resuscitation", category:"Module 2", hue:"--c-newborn", icon:"newborn", minutes:45, requires:["intro"],
   desc:"New routine care of the newborn (CPG 12.13) with hands-on thermal care, and revised newborn resuscitation (CPG 2.5).",
   coverage:"New CPG 12.13 · revised CPG 2.5",
   units:[
    {title:"Two pathways", lessons:[
     {id:"nb-1", title:"Two Newborns", steps:[
      {type:"sort", drop:true, label:"Case · first decision", scope:"AP", prompt:"Six babies, seconds after birth. Which pathway does each one need?", bins:["Routine newborn care","Newborn resuscitation"],
       cards:[{t:"Gasping, HR 80",b:1,why:"Gasping is ineffective breathing: resuscitation."},{t:"Term, crying, good tone, HR 140",b:0,why:"Breathing effectively with a satisfactory heart rate: routine care."},{t:"Slow, weak breaths, HR 50",b:1,why:"Ineffective breathing and HR below 60: resuscitation."},{t:"Born at 35 weeks, crying and breathing well",b:0,why:"Breathing effectively: routine care, even when preterm. Preterm thermal care still applies."},{t:"Apnoeic and floppy",b:1,why:"Apnoeic: resuscitation."},{t:"Meconium-stained liquor, crying and breathing well",b:0,why:"Breathing effectively: routine care, even after meconium-stained liquor."}],
       explain:"Breathing effectively with a satisfactory heart rate: routine newborn care (CPG 12.13), even when preterm or after meconium-stained liquor. Thermal care and the risk assessment still apply. Apnoeic, gasping or ineffective breathing, or a heart rate below 60: newborn resuscitation (CPG 2.5).", src:"CPG 12.13 pp.245–248 · CPG 2.5 pp.50–51"},
      {type:"read", title:"Keep the pathways separate", visual:"ways", body:"v2.6 adds a new routine care guideline and revises resuscitation. Decide which pathway applies first, then set your thermal and ventilation priorities. Before the birth: take the obstetric history (including gestation), prepare resuscitation equipment and a plan, and warm the environment.", src:"CPG 12.13 pp.248–249"},
      {type:"walk", vis:true, label:"Interactive algorithm", title:"Work through Baby B", scope:"AP",
       case:"Baby B: born at 30 weeks, not breathing effectively. Meconium-stained liquor. You can't see any obstruction.", facts:["Born at 30 weeks","Not breathing effectively","Meconium-stained liquor","No obstruction seen"], ref:"newborn-2", start:"a",
       nodes:{a:{short:"Breathing effectively?",q:"Is the baby breathing effectively?",opts:[{t:"Yes",ic:"yes",ev:1,why:"Baby B is not breathing effectively, so this is the resuscitation pathway."},{t:"No",ic:"no",to:"b"}]},
              b:{q:"Cord clamped and cut, baby dried and warm, head neutral, jaw thrust. Is there obstruction seen under direct vision?",short:"Obstruction seen?",opts:[{t:"Yes",ic:"yes",ev:3,why:"No obstruction is visible in this case."},{t:"No",ic:"no",to:"c"}]},
              c:{q:"What comes next?",opts:[{t:"Routine suction because of the meconium",ic:"suction",why:"Suction is only for obstruction seen under direct vision. The meconium indication was removed."},{t:"Five inflation breaths of 2–3 s with PEEP 6",ic:"lungs",to:"d"},{t:"Start chest compressions at a 3:1 ratio",ic:"comp",why:"Ventilation comes first. Compressions start only if HR stays <60 after 30 s of ventilation."}]},
              d:{short:"Oxygen for inflation breaths",q:"Baby B is 30 weeks. Which oxygen for the inflation breaths?",opts:[{t:"Room air (21%)",ic:"air",ev:0,why:"Room air is for 32 weeks or more."},{t:"30% oxygen",ic:"o2",to:"e"},{t:"100% oxygen",ic:"o2",why:"100% is for when compressions are needed."}]},
              e:{end:"Check for chest rise and reassess heart rate. If HR stays below 60 after 30 seconds of ventilation, start compressions at 3:1 with 100% oxygen.",tone:"p1"}},
       src:"CPG 2.5 pp.51–52"}
     ]},
     {id:"nb-2", title:"Thermal Care & Risks", steps:[
      {type:"sort", drop:true, label:"Normal or not?", scope:"AP", prompt:"A term baby in routine care, 10 minutes old. Is each finding normal?", bins:["Normal","Not normal"],
       cards:[{t:"Respiratory rate 52/min, irregular and abdominal",b:0,why:"40–60/min is normal, and irregular, abdominal breathing is normal in a newborn."},
        {t:"Heart rate 92/min, auscultated for 1 minute",b:1,why:"Normal is 100–160/min."},
        {t:"Heart rate 140/min, auscultated for 1 minute",b:0,why:"Within 100–160/min."},
        {t:"Temperature 35.8 °C",b:1,why:"Normal is 36–37.5 °C. Keep the newborn at or above 36.5 °C."},
        {t:"Floppy, with arms and legs extended",b:1,why:"Normal tone is flexed. A floppy baby needs urgent care."},
        {t:"Pink mucous membranes; skin tone still uneven",b:0,why:"Centrally pink mucous membranes are normal. Skin tone can differ for the first few minutes."}],
       explain:"Normal newborn observations: respiratory rate 40–60/min counted over 1 minute; heart rate 100–160/min auscultated for 1 minute, with SpO₂ and ECG monitoring too; temperature 36–37.5 °C; flexed tone; centrally pink mucous membranes.", src:"CPG 12.13 pp.246–247"},
      {type:"read", title:"Thermal care is mandatory", scope:"AP", visual:"thposter", top:"title", body:"Keep the newborn's temperature <b>at or above 36.5 °C</b> throughout care and transport. Also:",
       points:["<b>Preterm (&lt;37 weeks):</b> thermal mattress and plastic bag wrap are also mandatory","<b>Under 32 weeks:</b> don't dry the body. Once the cord is clamped and cut, place the baby directly into the polyethylene wrap, then the cap, a dry towel or blanket, and the thermal blanket","Keep doors and windows closed. Skin-to-skin is optional: only if mother and baby are well and warm and you can monitor airway and breathing","Measure the temperature soon after birth, during transport and on arrival at hospital; record each one in the ePCR"],
       src:"HMCAS newborn thermoregulation poster · CPG 12.13 pp.247–248 · HMCAS consultant guidance (newborn thermal care video)"},
      {type:"choice", label:"Preterm", scope:"AP", prompt:"A baby is born at 35 weeks and is breathing well. Which thermal care is mandatory?",
       options:["Dry, hat and wrap only, because the baby is well","Dry, hat, wrap, thermal mattress and plastic bag wrap","Skin-to-skin contact instead of a hat and wrap"], answer:1,
       fb:["Under 37 weeks is preterm: the thermal mattress and plastic bag wrap are mandatory even when the baby is well.",null,"Drying, a warm hat and wrapping are all mandatory, plus the thermal mattress and plastic bag wrap under 37 weeks."],
       explain:"Under 37 weeks is preterm, so the thermal mattress and plastic bag wrap are mandatory on top of drying, a hat and wrapping. At 35 weeks the baby is dried first; only under 32 weeks does the baby go into the wrap without drying.", src:"CPG 12.13 p.247"},
      {type:"choice", label:"Under 32 weeks", scope:"AP", prompt:"A baby is born at 30 weeks. The cord has been clamped and cut. What is the first thermal care step?",
       options:["Place the baby directly into the polyethylene wrap","Dry the body thoroughly, then apply the wrap","Dry the head and apply the cap, then the wrap"], answer:0,
       fb:[null,"Under 32 weeks, don't dry the body before the wrap. The wrap acts as a barrier that reduces heat loss through evaporation.","Under 32 weeks the wrap goes on first. The cap follows once the wrap is in place."],
       explain:"Under 32 weeks: place the newborn directly into the polyethylene wrap without drying the body. The wrap acts as a protective barrier, reducing heat loss through evaporation. Then continue the warm chain: cap, a dry towel or blanket, then the thermal blanket, as for a term newborn.", src:"HMCAS consultant guidance (newborn thermal care video) · CPG 12.13 p.247"},
      {type:"sort", drop:true, label:"Risks", scope:"AP", prompt:"Which risk does each finding point to?", bins:["Hypoglycaemia","Hypoxia","Sepsis","Jaundice"],
       cards:[{t:"Birth weight 2.2 kg",b:0,why:"Birth weight under 2.5 kg is a hypoglycaemia risk."},
        {t:"Mother takes a beta-blocker",b:0,why:"A mother on beta-blockers is a hypoglycaemia risk."},
        {t:"Cord prolapse during labour",b:1,why:"Cord compression or prolapse is a hypoxia risk."},
        {t:"Meconium-stained liquor",b:1,why:"Meconium may indicate perinatal hypoxia."},
        {t:"Membranes ruptured 30 hours before birth",b:2,why:"Membranes ruptured more than 18 hours is a sepsis risk."},
        {t:"Mother had group B strep this pregnancy",b:2,why:"GBS this pregnancy, or a previous GBS baby, is a sepsis risk."},
        {t:"An older sibling had neonatal jaundice",b:3,why:"Siblings with neonatal jaundice is a jaundice risk."},
        {t:"Bruising after a vacuum (instrumental) birth",b:3,why:"Bruising from an instrumental or caesarean birth is a jaundice risk."}],
       explain:"Hypoglycaemia: preterm, under 2.5 kg, small for gestational age, needed resuscitation, diabetic mother, mother on beta-blockers, hypothermia, perinatal hypoxia, infection. Hypoxia: cord compression or prolapse, placental or cord bleeding, meconium. Sepsis: maternal antibiotics for infection, GBS, preterm pre-labour rupture, membranes ruptured over 18 hours. Jaundice: under 38 weeks, siblings with neonatal jaundice, birth bruising, diabetic mother. Prenotify the receiving obstetric unit if the baby has complications or is being resuscitated.", src:"CPG 12.13 pp.245–248"}
     ]}
    ]},
    {title:"Thermal care: hands-on", lessons:[
     {id:"th-g", title:"Guided Practice", scene:"thermo", steps:[{type:"stage",stage:"thintro"},{type:"stage",stage:"th",key:"dry"},{type:"stage",stage:"th",key:"cap"},{type:"stage",stage:"th",key:"towel"},{type:"stage",stage:"th",key:"thermal"},{type:"stage",stage:"th",key:"temp1"},{type:"stage",stage:"th",key:"ac"},{type:"stage",stage:"th",key:"door"},{type:"stage",stage:"th",key:"temp2"}]},
     {id:"th-6", title:"Solo Round", scene:"thermo", thRun:true, steps:[{type:"stage",stage:"th",key:"dry"},{type:"stage",stage:"th",key:"cap"},{type:"stage",stage:"th",key:"towel"},{type:"stage",stage:"th",key:"thermal"},{type:"stage",stage:"th",key:"temp1"},{type:"stage",stage:"th",key:"ac"},{type:"stage",stage:"th",key:"door"},{type:"stage",stage:"th",key:"temp2"}]}
    ]},
    {title:"Resuscitation", lessons:[
     {id:"nb-3", title:"Resuscitation Decisions", steps:[
      {type:"choice", label:"Airway", scope:"AP", prompt:"The liquor is meconium-stained and the baby is not breathing. You cannot see any obstruction. What do you do about suction?",
       options:["Suction routinely before giving breaths","Don't suction; start five inflation breaths","Suction until the liquor runs clear"], answer:1,
       fb:["Suction is used only for obstruction seen under direct vision.",null,"Prolonged suction delays ventilation. Suction only for visible obstruction."],
       explain:"With no visible obstruction, move straight on to the five inflation breaths. Assess breathing, heart rate, response to stimulation and tone (not skin colour). Stimulate gently, head neutral with a pad under the shoulders if needed, jaw thrust preferred. Suction only for obstruction under direct vision: mouth, then nose. OPA if BVM ventilation is expected to be difficult; SGA if BVM is ineffective, apnoea persists or prolonged ventilation and compressions are needed.", src:"CPG 2.5 pp.50–51"},
      {type:"choice", label:"Inflation breaths", scope:"AP", prompt:"A baby born at 38 weeks is apnoeic. Which settings do you use for the inflation breaths?",
       options:["Room air with PEEP 6 cmH₂O","30% oxygen with PEEP 6 cmH₂O","100% oxygen with no PEEP"], answer:0,
       fb:[null,"30% oxygen is for babies under 32 weeks. At 38 weeks use room air.","Start in room air (21%) at 32 weeks or more, and always attach PEEP 6 cmH₂O."],
       explain:"Start positive pressure ventilation ideally within 60 seconds of birth: 5 inflation breaths of 2–3 seconds with a PEEP valve at 6 cmH₂O. ≥32 weeks room air (21%); <32 weeks 30% oxygen. No chest rise: open the airway, reposition, check the volume. A rising HR or a stable HR >100 means ventilation is working.", src:"CPG 2.5 p.51"},
      {type:"scrub", scrub:"newborn", label:"Explore", scope:"AP"},
      {type:"walk", vis:true, label:"Interactive algorithm", title:"Reassess and branch", scope:"AP",
       case:"Term baby, apnoeic. You've given 5 inflation breaths with PEEP 6 in room air and are ventilating with good chest rise.", facts:["Term baby","Apnoeic","5 inflation breaths given, PEEP 6, room air","Ventilating with good chest rise"], ref:"newborn-2", start:"a",
       nodes:{a:{short:"HR 50 after 30 s",mon:{hr:50},q:"After 30 seconds of ventilation, HR is 50. What now?",opts:[{t:"Keep ventilating and recheck in 2 minutes",ic:"wait",why:"HR <60 after 30 s of ventilation is the compression trigger."},{t:"Compressions 3:1, two-thumb, oxygen up to 100%",ic:"comp",to:"b"},{t:"Compressions 15:2, two-thumb, oxygen unchanged",ic:"comp",why:"Newborn ratio is 3:1."}]},
              b:{short:"Next check",q:"When do you next check HR and breathing?",opts:[{t:"In 30 seconds",ic:"timer",to:"c"},{t:"In 2 minutes",ic:"timer",why:"Reassess every 30 seconds."},{t:"In 60 seconds",ic:"timer",why:"Reassess every 30 seconds."}]},
              c:{short:"HR 120, breathing",mon:{hr:120},q:"HR is now 120 and the baby is breathing on their own. What next?",opts:[{t:"Stop ventilations and titrate oxygen to target",ic:"stop",to:"e"},{t:"Continue compressions for 2 more minutes",ic:"comp",why:"HR >100 with adequate breathing: stop compressions and ventilations."},{t:"Stop compressions but keep ventilating",ic:"lungs",why:"HR >100 with adequate breathing: stop compressions and ventilations."}]},
              e:{end:"Aim for SpO₂ >80% and HR >100 by 5 minutes. Keep temperature 36.5–37.5 °C. Bradycardia is usually due to hypoxia, so effective ventilation comes first; keep 3:1 once an SGA is in, and prepare IV/IO access.",tone:"p1"}},
       src:"CPG 2.5 p.52"},
      {type:"choice", label:"Targets", scope:"AP", prompt:"At 3 minutes after birth the baby's SpO₂ is 72% and HR is 130. What do you make of this?",
       options:["Within the expected range for 3 minutes","Hypoxic: start compressions straight away","Increase to 100% oxygen immediately"], answer:0,
       fb:[null,"HR 130 is satisfactory, and SpO₂ 70–75% is expected at 3 minutes. Compressions start only if HR stays below 60 after 30 seconds of ventilation.","SpO₂ 70–75% is expected at 3 minutes. The target is above 80% by 5 minutes."],
       explain:"Expected preductal SpO₂: 1 min 60–65% · 2 min 65–70% · 3 min 70–75% · 4 min 75–80% · 5 min 80–85% · 10 min 85–95%. Avoid SpO₂ <80% or bradycardia at 5 minutes. Fluids: normal saline 10 ml/kg IV/IO, may be repeated once. Still poorly responsive despite good ventilation, perfusion and temperature: RBS from the lateral heel; if low, dextrose 10% 2 ml/kg. Shockable rhythm is very rare: 4 J/kg, pads anterior-posterior. Parents may stay; assign a paramedic to support them if resources allow.", src:"CPG 2.5 pp.51–52 · CPG 12.13 p.249"}
     ]},
     {id:"nb-5", title:"Glucose & Cord", steps:[
      {type:"sort", drop:true, label:"Match the context", scope:"AP", prompt:"Match each glucose treatment to its context.", bins:["Routine newborn care","Newborn resuscitation"],
       cards:[{t:"Pea-sized buccal glucose, repeat as required",b:0,why:"Routine care: buccal glucose for hypoglycaemia."},{t:"Dextrose 10% 2 ml/kg IV/IO",b:1,why:"Resuscitation: dextrose 10% 2 ml/kg if hypoglycaemic. IV dextrose is generally not needed in routine care."},{t:"Treat if RBS <2.6 mmol/L",b:0,why:"Routine care: treat an RBS below 2.6 mmol/L with buccal glucose."},{t:"Check RBS if responsiveness stays poor despite good ventilation",b:1,why:"Resuscitation: check the RBS if the baby stays poorly responsive despite good ventilation."}],
       explain:"Routine care: RBS <2.6 mmol/L → buccal glucose; IV dextrose is generally not needed. Resuscitation: dextrose 10% 2 ml/kg if hypoglycaemic. Never glucagon.", src:"CPG 12.13 pp.248–249 · CPG 2.5 p.52"},
      {type:"choice", label:"Glucagon", scope:"AP", prompt:"A colleague suggests IM glucagon for a hypoglycaemic newborn. What do you say?",
       options:["Fine, IM is the fastest route for a newborn","No. It should not be given; use buccal glucose","Only if the RBS is very low and buccal glucose fails"], answer:1,
       fb:["Glucagon should not be given to a newborn. Use pea-sized buccal glucose.",null,"Glucagon is not given to newborns at any glucose level. Repeat buccal glucose as required."],
       explain:"Glucagon should not be administered to the newborn. Early breastfeeding can help prevent hypoglycaemia, but not if it risks hypothermia.", src:"CPG 12.13 p.248"},
      {type:"choice", label:"Case", scope:"AP", prompt:"A newborn is floppy and apnoeic at birth. When do you clamp the cord?",
       options:["Wait the full 60 seconds, then clamp and cut","Clamp and cut now, then start resuscitation","Leave it uncut until you reach hospital"], answer:1,
       fb:["Delayed clamping is for well babies. Don't delay resuscitation to wait 60 seconds.",null,"If resuscitation is needed, clamp and cut straight away so it can start."],
       explain:"If resuscitation or urgent intervention is needed, clamp and cut straight away and move to a dry, warm area. For a well baby, leave the cord intact for at least 60 seconds (it turns white), then clamp and cut about 5 cm from the umbilicus. If the cord has snapped, watch for hypovolaemia: pale mucous membranes, respiratory distress.", src:"CPG 12.13 p.247 · CPG 2.5 p.52"},
      {type:"read", title:"Very early births", scope:"AP", body:"This is one of the hardest situations you'll attend. CPG 12.13 and 2.5 give clear guidance:",
       points:["Babies born <b>under 20 weeks</b> are not viable and resuscitation is not required","They may show brief reflex activity (gasps, chest wall pulsation, twitches), usually in the first minute. These are not signs of viable life","Explain gently to the parents that the baby has been born too early to survive, and that they may see these movements","Wrap the baby and offer the parents the chance to hold them","Over 20 weeks, or gestation unknown with signs of life: resuscitate per CPG 2.5","<b>If in doubt, resuscitate.</b> Once started prehospitally, resuscitation is not stopped"], src:"CPG 12.13 pp.247–248 · CPG 2.5 p.52"},
      {type:"choice", label:"Gestation unknown", scope:"AP", prompt:"The mother isn't sure of her dates. The baby is small and gasping. What do you do?",
       options:["Withhold resuscitation, as the baby looks very premature","Begin resuscitation, as there are signs of life","Wait a minute to see if the gasps continue"], answer:1,
       fb:["With unknown gestation and signs of life, start resuscitation. If in doubt, resuscitate.",null,"Gasping is a sign of life. Start resuscitation without waiting."],
       explain:"If gestation is unknown and there are signs of life, or if in any doubt, start resuscitation.", src:"CPG 12.13 p.247"}
     ]}
    ]},
    {title:"Newborn resuscitation: hands-on", lessons:[
     {id:"nr-g", title:"Guided Practice", scene:"nbr", steps:[{type:"stage",stage:"nrintro"},{type:"stage",stage:"nrkit"},{type:"stage",stage:"nrcord"},{type:"stage",stage:"nrset"},{type:"stage",stage:"nrbreath"},{type:"stage",stage:"nrhr"},{type:"stage",stage:"nrcomp"},{type:"stage",stage:"nrmon"},{type:"stage",stage:"nrglu"}]},
     {id:"nr-6", title:"Solo Run", scene:"nbr", rxRun:"nbr", steps:[{type:"stage",stage:"nrkit"},{type:"stage",stage:"nrcord"},{type:"stage",stage:"nrset"},{type:"stage",stage:"nrbreath"},{type:"stage",stage:"nrhr"},{type:"stage",stage:"nrcomp"},{type:"stage",stage:"nrmon"},{type:"stage",stage:"nrglu"}]}
    ]},
    {title:"Module check", lessons:[{id:"nb-x", title:"Newborn Check", mode:"exit", bank:"newborn"}]}
   ]},

);
