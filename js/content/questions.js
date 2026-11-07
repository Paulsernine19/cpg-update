/* =====================================================================
   COURSE CONTENT — from "CPG v2.6 Instructional Design Package"
   (clinical-review draft, 13 Oct 2026), checked against the approved
   HMCAS CPG v2.6 (2026). "CPG x.y p.N" = page in the approved CPG.
   Sources: "Circular" = AS/SC 26-56 (22 Sep 2026); "Summary" = CPG v2.5
   to v2.6 Summary of Changes.
   Step types: read, choice, sort, multi, input, lookup, blocked, video
   scope: "AP" (AP & CCP) | "CCP" (CCP only; APs recognise & escalate) | "verify"
   ===================================================================== */
const MODS={trauma:"Trauma",newborn:"Newborn",cardiac:"Cardiac arrest",stroke:"Stroke"};
const CRITICAL=["Q2","Q3","Q8","Q9","Q16","Q17","Q22","FT3","FT4"];

/* ---------- Draft question bank (QB), used by module checks; also by the final for modules with no FQ questions yet ---------- */
const QB=[
 {id:"Q1",mod:"trauma",lesson:"tr-1",scope:"AP",prompt:"An alert collision patient has neck pain, follows instructions, can stand and has no neurological deficit. Which approach should be considered first?",
  options:["Routine immobilised extraction because of the neck pain","Self-extrication or minimally assisted extrication","Leave the patient in the vehicle until the pain resolves"],answer:1,
  fb:["Neck pain is no longer a reason for an immobilised extraction. Self-extrication is first line unless there's a contraindication.",null,"Trapped patients are time critical. Extricate as soon as possible."],
  explain:"Self-extrication or minimal assistance is now the standard first-line technique, including for patients with neck or back pain. Contraindications are inability to follow instructions or to stand on at least one leg.",src:"CPG 10.13 p.200"},
 {id:"Q2",mod:"trauma",lesson:"tr-3",scope:"AP",prompt:"A 9-year-old has an isolated head injury from a fall 1 hour ago. GCS 11. Can you, as an AP, give TXA?",
  options:["No. Paediatric TXA is for CCPs only","Yes. Isolated TBI with GCS ≤12 within 3 hours is an AP indication","Yes, every child with a head injury gets TXA"],answer:1,
  fb:["That was v2.5. Paediatric IV TXA is now within AP scope.",null,"Head injury alone isn't enough. It must be isolated TBI with GCS ≤12, in major trauma less than 3 hours old."],
  explain:"Isolated paediatric TBI with GCS ≤12 in major trauma under 3 hours old is now a TXA indication, and AP administration is included. Check the contraindications before giving.",src:"Formulary TXA p.392 · Circular rows 27–28 · HMCAS Paediatric IV TXA poster"},
 {id:"Q3",mod:"trauma",lesson:"tr-3",scope:"AP",prompt:"Which obstetric category remains a TXA indication in the update?",
  options:["Ectopic pregnancy","Placenta praevia","Postpartum haemorrhage","Miscarriage"],answer:2,
  fb:["TXA has been removed from the ectopic pregnancy algorithm.","TXA has been removed from the placenta praevia algorithm.",null,"TXA has been removed from the miscarriage algorithm."],
  explain:"Postpartum haemorrhage is now the only obstetric TXA indication. Removal from the other algorithms does not remove the need for urgent haemorrhage care.",src:"Circular rows 22–25, 29 · Summary p.4"},
 {id:"Q4",mod:"trauma",lesson:"tr-5",scope:"AP",prompt:"Which newly included finding must be checked against the trauma bypass criteria?",
  options:["Abdominal seat belt sign","Ejection (partial or complete) from the vehicle","Roll-over with roof deformity"],answer:0,
  fb:[null,"Ejection was already a bypass criterion in v2.5. The new one is the abdominal seat belt sign.","Roll-over with roof deformity was already a bypass criterion in v2.5. The new one is the abdominal seat belt sign."],
  explain:"The abdominal seat belt sign is newly included. The complete destination decision still follows CPG 10.10.",src:"CPG 10.10 p.194 · Circular row 19"},
 {id:"Q5",mod:"trauma",lesson:"tr-6",scope:"AP",prompt:"A patient has neurogenic shock from a spinal cord injury and is also bleeding from a pelvic injury. Which MAP target applies?",
  options:["MAP 85–90 mmHg","MAP ≥65 mmHg","No target; avoid fluids completely"],answer:1,
  fb:["85–90 mmHg is for isolated neurogenic shock. With a pelvic bleed this is combined shock.",null,"Hypotension must be avoided. Give fluids judiciously, aiming for MAP ≥65 mmHg in combined shock."],
  explain:"Combined haemorrhagic and neurogenic shock: MAP ≥65 mmHg. MAP 85–90 mmHg is for isolated spinal cord injury with neurogenic shock. Noradrenaline is the preferred vasopressor (CCP).",src:"CPG 10.3 p.178"},
 {id:"Q6",mod:"newborn",lesson:"nb-2",scope:"AP",prompt:"A baby born at 34 weeks is breathing well and doesn't need resuscitation. Which thermal care is mandatory?",
  options:["Dry, warm hat and wrap only","Dry, warm hat and wrap, plus a thermal mattress and plastic bag wrap","Skin-to-skin contact instead of a hat and wrap"],answer:1,
  explain:"Drying, a warm hat and wrapping are mandatory for every newborn. Preterm babies (<37 weeks) must also get a thermal mattress and plastic bag wrap. Keep the temperature ≥36.5 °C.",src:"CPG 12.13 p.247"},
 {id:"Q7",mod:"newborn",lesson:"nb-5",scope:"AP",prompt:"A term newborn in routine care is jittery with an RBS of 2.2 mmol/L. What is the preferred treatment?",
  options:["Glucagon IM","Buccal glucose, a pea-sized amount, repeated as required","IV dextrose 10% straight away"],answer:1,
  explain:"RBS <2.6 mmol/L: buccal glucose is preferred. Glucagon must not be given to a newborn, and IV dextrose is generally not needed outside resuscitation.",src:"CPG 12.13 pp.248–249"},
 {id:"Q8",mod:"newborn",lesson:"nb-3",scope:"AP",prompt:"A baby born at 30 weeks is apnoeic. How do you start ventilation?",
  options:["5 inflation breaths of 2–3 s, PEEP 6 cmH₂O, 30% oxygen","5 inflation breaths of 2–3 s, PEEP 6 cmH₂O, room air","Normal breaths with 100% oxygen and no PEEP"],answer:0,
  explain:"Under 32 weeks: 30% oxygen with PEEP 6 cmH₂O. At 32 weeks or more: room air (21%) with PEEP 6. Start within 60 seconds of birth if possible.",src:"CPG 2.5 p.51"},
 {id:"Q9",mod:"cardiac",lesson:"ca-1",scope:"AP",prompt:"In adult medical shockable arrest, when is the first adrenaline given?",
  options:["After the second shock","After the third shock, then every four minutes","Only after ROSC"],answer:1,
  explain:"After the third shock, then every four minutes. In non-shockable rhythms, adrenaline is given as soon as IV/IO access is in. Don't transfer this to trauma or paediatric arrest.",src:"CPG 2.1 · Summary p.1"},
 {id:"Q10",mod:"cardiac",lesson:"ca-1",scope:"AP",prompt:"In adult arrest, when is the second amiodarone dose given?",
  options:["After the fourth shock","After the fifth shock","Before the first shock"],answer:1,
  explain:"300 mg after the third shock and 150 mg after the fifth (was the fourth in v2.5).",src:"CPG 2.1 · Summary p.1"},
 {id:"Q11",mod:"cardiac",lesson:"ca-3",scope:"AP",prompt:"For a paediatric arrest patient weighing under 25 kg, which pad position is the first choice?",
  options:["Anterior-posterior","Anterior-lateral is always mandatory","Pad position does not matter"],answer:0,
  explain:"Anterior-posterior is first choice under 25 kg. Over 25 kg, either anterior-lateral or anterior-posterior may be used.",src:"CPG 2.3 p.42"},
 {id:"Q12",mod:"cardiac",lesson:"ca-4",scope:"AP",prompt:"Which SpO₂ target applies after ROSC?",
  options:["94–98%","Any value above 90% without an upper target","100% for all patients throughout transport"],answer:0,
  explain:"94–98%. Avoid hyperoxaemia (SpO₂ at 100% for prolonged periods).",src:"CPG 2.6 p.54"},
 {id:"Q13",mod:"cardiac",lesson:"ca-5",scope:"AP",prompt:"How does ventilation start in a drowning cardiac arrest?",
  options:["Five ventilations with a BVM and 100% oxygen","No ventilations until hospital arrival","Compressions only for the first two minutes"],answer:0,
  explain:"Five ventilations with a BVM and 100% oxygen, then standard arrest management. Consider hypothermia, spinal injury and e-CPR criteria.",src:"CPG 2.8 p.58"},
 {id:"Q14",mod:"cardiac",lesson:"ca-6",scope:"CCP",prompt:"An adult with a regular narrow-complex tachycardia is in life-threatening compromise. The CCP prepares to cardiovert. Which first energy does v2.6 give?",
  options:["120 J","150 J","200 J"],answer:0,
  explain:"Narrow-complex adult: regular 120 J, irregular 200 J, with stepwise escalation. 150 J is for broad-complex. Synchronised cardioversion is CCP scope: the AP recognises the unstable tachycardia, applies pads and requests a CCP.",src:"CPG 4.4 p.79 · CPG 4.3 p.77"},
 {id:"Q15",mod:"cardiac",lesson:"ca-6",scope:"CCP",prompt:"A CCP gave ondansetron and wants to sign the patient off to you for transport. Which condition set is correct?",
  options:["Any patient may be signed off after any antiemetic","The patient is stable, has no adverse effects, and has had no other CCP medications that aren't approved for AP sign-off","Sign-off is only allowed if the patient is asleep"],answer:1,
  explain:"All three conditions must be met: stable, no adverse effects, and no other CCP medications not approved for sign-off to APs.",src:"CPG 6.4 · ondansetron formulary"},
 {id:"Q16",mod:"stroke",lesson:"st-3",scope:"AP",prompt:"A BEFAST-positive patient was last known well 10 hours ago and has RACE 6. Where do they go?",
  options:["P1 to HGH ED with prenotification via CC:E","P2 to nearest appropriate ED","No transport"],answer:0,
  explain:"More than 8 and less than 24 hours with RACE ≥5: P1 to HGH ED with prenotification via CC:E.",src:"CPG 3.1 p.64"},
 {id:"Q17",mod:"stroke",lesson:"st-3",scope:"AP",prompt:"A BEFAST-positive patient has a wake-up stroke with unknown onset. Where do they go?",
  options:["P2 because the exact time is unavailable","P1 to HGH ED with prenotification via CC:E","Use the removed 15-hour threshold"],answer:1,
  explain:"Wake-up or unknown onset is treated as an acute stroke: P1 to HGH ED with prenotification via CC:E.",src:"CPG 3.1 p.64"},
 {id:"Q18",mod:"stroke",lesson:"st-3",scope:"AP",prompt:"Last known well was exactly 8 hours ago. Which branch applies?",
  options:["The ≤8-hour branch: P1 to HGH ED with prenotification","The >8 to <24-hour RACE branch","The ≥24-hour branch"],answer:0,
  explain:"Exactly 8 hours falls in the ≤8-hour branch.",src:"CPG 3.1 p.64"},
 {id:"Q19",mod:"stroke",lesson:"st-3",scope:"AP",prompt:"Last known well was exactly 24 hours ago. Which branch applies?",
  options:["P1 because RACE is high","P2 to the nearest appropriate ED","The old 15-hour branch"],answer:1,
  explain:"24 hours falls in the ≥24-hour branch: P2 to the nearest appropriate ED. RACE is not used here.",src:"CPG 3.1 p.64"},
 {id:"Q20",mod:"stroke",lesson:"st-4",scope:"AP",prompt:"Which handover set matches the stroke prenotification checklist?",
  options:["Age and ETA only","Age, last seen well, BEFAST, RACE if done, RBS, BP, anticoagulant status and ETA","RACE alone"],answer:1,
  explain:"Age, last seen well, BEFAST, RACE if done, RBS, BP, anticoagulant status and ETA.",src:"CPG 3.1 p.62"},
 {id:"Q21",mod:"trauma",lesson:"tr-1",scope:"AP",prompt:"A trapped driver can't move or feel their legs. Which extrication approach applies?",
  options:["Self-extrication with verbal guidance","Rapid extrication with gentle handling","Wait for full monitoring before any movement"],answer:1,
  fb:["Hard neurological signs rule out self-extrication.",null,"Keep monitoring to a minimum while the patient is trapped. Hard signs mean rapid extrication with gentle handling."],
  explain:"Hard neurological signs (loss of motor and sensory function) mean rapid extrication with gentle handling. Soft signs such as tingling that doesn't follow a nerve pathway (non-dermatomal tingling) don't rule out self-extrication.",src:"CPG 10.13 p.200"},
 {id:"Q22",mod:"newborn",lesson:"nb-4",scope:"AP",prompt:"After 30 seconds of effective BVM ventilation, the newborn's heart rate is 50/min. What next?",
  options:["Continue ventilation only and recheck in 2 minutes","Start compressions at 3:1 using the two-thumb technique and increase oxygen to 100%","Give glucagon"],answer:1,
  explain:"HR still <60 after 30 seconds of ventilation: start compressions at 3:1 with the two-thumb technique, 100% oxygen, and reassess HR and breathing every 30 seconds.",src:"CPG 2.5 p.52"},
 {id:"Q23",mod:"cardiac",lesson:"ca-2",scope:"AP",prompt:"Adult traumatic cardiac arrest. When is adrenaline first given?",
  options:["As soon as IV access is in","After reversible causes are managed and at least 500 ml normal saline has been given","After the third shock"],answer:1,
  explain:"Trauma arrest: no adrenaline until reversible causes are managed and at least 500 ml NS is in. Then every 4 minutes.",src:"CPG 2.2 p.35"},
 {id:"Q24",mod:"stroke",lesson:"st-3",scope:"AP",prompt:"BEFAST positive, last known well 12 hours ago, RACE 3. Where do they go?",
  options:["P1 to HGH ED","P2 to the nearest appropriate ED","No transport needed"],answer:1,
  explain:">8 and <24 hours with RACE <5: P2 to the nearest appropriate ED.",src:"CPG 3.1 p.64"}
];

/* ---------- Final-only questions (FQ): never shown in a module check. Once a module has questions here,
   the final uses them instead of that module's QB questions, and its module check gets full feedback back.
   DRAFT: awaiting clinical review. Modules still to do: newborn, cardiac, stroke. ---------- */
const FQ=[
 {id:"FT1",mod:"trauma",lesson:"tr-1",scope:"AP",prompt:"After a collision, a driver is alert, follows instructions and has no neurological deficit. The right ankle is deformed, but they can stand on the left leg. Which extrication approach applies?",
  options:["Self-extrication or minimally assisted extrication","Manual extrication on the combi-carrier","Rapid extrication with gentle handling"],answer:0,
  explain:"The contraindication is injury that prevents standing on at least one leg, so one injured ankle does not rule out self-extrication. Rapid extrication is for hard neurological signs.",src:"CPG 10.13 p.200"},
 {id:"FT2",mod:"trauma",lesson:"tr-1",scope:"AP",prompt:"An adult has been trapped since a collision 20 minutes ago. They are pale and tachycardic, and you suspect major haemorrhage. Civil Defence are still cutting the vehicle. What is the priority while they remain trapped?",
  options:["Control any haemorrhage and consider TXA","Complete a full head-to-toe assessment before giving TXA","Attach full monitoring and repeat full sets of vital signs"],answer:0,
  explain:"Care during entrapment is limited to critical interventions, including haemorrhage control and TXA if indicated. Keep monitoring to a minimum. The head-to-toe assessment follows extrication.",src:"CPG 10.13 pp.200, 202"},
 {id:"FT3",mod:"trauma",lesson:"tr-3",scope:"AP",prompt:"A 6-year-old fell from a balcony 3½ hours ago. Isolated head injury, GCS 9. You are the AP on scene. What do you do about TXA?",
  options:["Give it, because the GCS is 12 or below","Withhold it, because the injury is more than 3 hours old","Withhold it, because paediatric TXA is for CCPs only"],answer:1,
  explain:"The GCS meets the threshold, but injury more than 3 hours old is a contraindication. Paediatric TXA is within AP scope in v2.6.",src:"Formulary TXA p.392 · HMCAS Paediatric IV TXA poster"},
 {id:"FT4",mod:"trauma",lesson:"tr-3",scope:"AP",prompt:"A woman at 36 weeks has painless, bright red vaginal bleeding and signs of shock. You suspect placenta praevia. What do you do?",
  options:["Give TXA, because she is in shock","Give TXA only if the bleeding continues after IV fluids","Withhold TXA, manage shock as per CPG 6.5 and transport to the nearest appropriate ED"],answer:2,
  explain:"TXA was removed from the placenta praevia algorithm, and shock does not change this. Removal does not reduce the urgency of haemorrhage care.",src:"CPG 12.4 pp.226–227 · Formulary TXA p.392 · Circular row 25"},
 {id:"FT5",mod:"trauma",lesson:"tr-4",scope:"AP",visual:"txachart",prompt:"A 9-year-old meets the TXA criteria, and 1 g has been added to the 100 mL bag. Using the chart, what do you do next?",
  options:["Draw up 50 mL into a syringe and give it over 10 minutes","Draw out and discard 40 mL, then give the remaining volume over 10 minutes","Draw out and discard 50 mL, then give the remaining volume over 10 minutes"],answer:1,
  explain:"From age 8, draw out and discard the chart volume (40 mL). The remaining 60 mL is the 50 mL dose plus 10 mL to compensate for the administration set.",src:"HMCAS Paediatric IV TXA poster"},
 {id:"FT6",mod:"trauma",lesson:"tr-5",scope:"AP",prompt:"A 12-year-old restrained passenger has bruising along the path of the seat belt across the abdomen. GCS 15, vital signs normal, and an ED is 5 minutes away. What is your destination decision?",
  options:["Transport to the nearest ED, because the vital signs are normal","Notify the CCD and transport directly to the HGH Trauma Resuscitation Unit","Notify the CCD and transport directly to the Sidra Hospital ED"],answer:2,
  explain:"The abdominal seat belt sign meets the bypass criteria even with normal vital signs. Paediatric patients go to the Sidra Hospital ED.",src:"CPG 10.10 p.194 · Circular row 19"},
 {id:"FT7",mod:"trauma",lesson:"tr-6",scope:"AP",prompt:"After a fall from height, a patient is hypotensive and cannot move their legs. You suspect neurogenic shock. What must you do before applying a neurogenic shock MAP target?",
  options:["Rule out other causes of shock, such as major haemorrhage and TBI","Give repeated fluid boluses until the blood pressure is normal","Wait for a CCP to start a vasopressor before treating the hypotension"],answer:0,
  explain:"Other causes of shock must be ruled out and managed as per their CPG. Hypotension must be avoided, and fluids are given judiciously to avoid overload.",src:"CPG 10.3 p.178"}
];
/* Modules with final-only questions use them in the final; the rest still reuse their QB questions */
const hasFinalQs=m=>FQ.some(q=>q.mod===m);
const FINAL_BANK=[...FQ,...QB.filter(q=>!hasFinalQs(q.mod))];

/* ---------- Icebreaker "Still true or changed?": ungraded, instant reveal, shuffled per attempt.
   Each statement is a v2.5 habit, checked against v2.5 and v2.6. short = label on the end screen; was/now = v2.5 → v2.6 strip ---------- */
const TC=["Still true in v2.6","Changed in v2.6"];
const DQ=[
 {id:"D1",mod:"trauma",short:"TXA for children",prompt:"“APs give TXA to adults only, not to children.”",options:TC,answer:1,
  was:"Children: CCP only, major haemorrhage only",now:"Children: APs and CCPs, major haemorrhage or TBI with GCS ≤12",
  explain:"APs can now give TXA to children (under 14) with major trauma less than 3 hours old. Covered in Module 1.",src:"Formulary TXA v2.6 p.392 (v2.5 p.377) · Circular rows 12–20, 27–28"},
 {id:"D2",mod:"trauma",short:"Ejection as a bypass criterion",prompt:"“Ejection (partial or complete) from a vehicle meets the trauma bypass criteria.”",options:TC,answer:0,
  explain:"Still a bypass criterion. What's new in CPG 10.10 is the abdominal seat belt sign. Covered in Module 1.",src:"CPG 10.10 p.194 · Circular row 19"},
 {id:"D3",mod:"trauma",short:"TXA in antepartum bleeding",prompt:"“TXA is given for antepartum bleeding from a placental abruption.”",options:TC,answer:1,
  was:"Ante- or post-partum haemorrhage",now:"Post-partum haemorrhage only",
  explain:"TXA was removed from the ectopic, miscarriage, abruption and praevia algorithms. Covered in Module 1.",src:"Formulary TXA v2.6 p.392 (v2.5 p.377) · Circular rows 22–25, 29"},
 {id:"D10",mod:"trauma",short:"Self-extrication",prompt:"“An alert patient with neck pain, who can follow instructions and stand, is extricated on a board rather than self-extricating.”",options:TC,answer:1,
  was:"No extrication guideline",now:"Self-extrication first-line, including neck or back pain",
  explain:"Self-extrication or minimal assistance is now the first-line technique. Contraindications: unable to follow instructions, or unable to stand on at least one leg. Covered in Module 1.",src:"CPG 10.13 p.200 · Circular row 21"},
 {id:"D4",mod:"newborn",short:"Suction for meconium",prompt:"“Meconium-stained liquor on its own is a reason to suction the newborn.”",options:TC,answer:1,
  was:"Airway obstruction or meconium-stained fluid",now:"Airway obstruction only, under direct vision",
  explain:"Meconium alone is no longer a reason to suction. Covered in Module 2.",src:"CPG 2.5 v2.6 p.51 (v2.5 p.48)"},
 {id:"D5",mod:"newborn",short:"Newborn suction order",prompt:"“If a newborn needs suction, suction the mouth first, then the nose.”",options:TC,answer:0,
  explain:"Unchanged: mouth first, then nose. What changed is when suction is used. Covered in Module 2.",src:"CPG 2.5 p.51"},
 {id:"D11",mod:"newborn",short:"Preterm thermal care",prompt:"“A preterm baby under 32 weeks is placed in a plastic wrap without drying, to reduce heat loss.”",options:TC,answer:0,
  explain:"Correct practice. Drying a baby under 32 weeks increases heat loss, so the baby goes straight into the plastic wrap. All preterm babies (under 37 weeks) also need a thermal mattress and plastic bag wrap. Covered in Module 2.",src:"HMCAS consultant guidance (newborn thermal care video) · CPG 12.13 p.247"},
 {id:"D6",mod:"cardiac",short:"First amiodarone dose",prompt:"“Adult shockable arrest: the first amiodarone dose (300 mg) is given after the 3rd shock.”",options:TC,answer:0,
  explain:"Unchanged: 300 mg after the 3rd shock. Other parts of the arrest algorithm did change. Covered in Module 3.",src:"CPG 2.1 p.35"},
 {id:"D7",mod:"cardiac",short:"Broad-complex cardioversion energy",prompt:"“Adult broad-complex synchronised cardioversion starts at 200 J.”",options:TC,answer:1,
  was:"200 J",now:"150 J, stepwise escalation if needed",
  explain:"Covered in Module 3.",src:"CPG 4.3 v2.6 p.77 (v2.5 p.72)"},
 {id:"D8",mod:"stroke",short:"Stroke time window",prompt:"“A BEFAST-positive patient with symptom onset under 15 hours goes P1 to HGH ED.”",options:TC,answer:1,
  was:"Under 15 h: P1 · over 15 h: P2",now:"Up to 8 h: P1 · 8–24 h: RACE ≥5 P1, <5 P2 · 24 h or more: P2",
  explain:"The 15-hour cut-off is gone. Covered in Module 4.",src:"CPG 3.1 v2.6 p.64 (v2.5 p.59)"},
 {id:"D9",mod:"stroke",short:"Wake-up stroke",prompt:"“A wake-up stroke is treated as an acute stroke and transported P1.”",options:TC,answer:0,
  explain:"Unchanged. Wake-up or unknown-onset stroke is still treated as acute: P1 to HGH ED with prenotification. Covered in Module 4.",src:"CPG 3.1 p.64"}
];

