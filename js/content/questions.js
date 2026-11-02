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
const CRITICAL=["Q2","Q3","Q8","Q9","Q16","Q17","Q22"];

/* ---------- Draft question bank (Q1–Q20), used by module checks and the final ---------- */
const QB=[
 {id:"Q1",mod:"trauma",lesson:"tr-1",scope:"AP",prompt:"An alert collision patient has neck pain, follows instructions, can stand and has no neurological deficit. Which approach should be considered first?",
  options:["Routine immobilised extraction because of the neck pain","Self-extrication or minimally assisted extrication","Leave the patient in the vehicle until the pain resolves"],answer:1,
  explain:"Self-extrication or minimal assistance is now the standard first-line technique, including for patients with neck or back pain. Contraindications are inability to follow instructions or to stand on at least one leg.",src:"CPG 10.13 p.200"},
 {id:"Q2",mod:"trauma",lesson:"tr-3",scope:"AP",prompt:"A paediatric patient has an isolated traumatic brain injury and GCS 11. What changed for the AP?",
  options:["Paediatric TXA remains exclusively a CCP intervention in all circumstances","Isolated paediatric TBI with GCS ≤12 is included in the updated TXA indication, with AP administration included in the formulary, subject to its full criteria","TXA is indicated for every child with any head injury"],answer:1,
  explain:"Isolated paediatric TBI with GCS ≤12 in major trauma under 3 hours old is now a TXA indication, and AP administration is included. Check the contraindications before giving.",src:"Circular rows 27–28 · HMCAS Paediatric IV TXA poster"},
 {id:"Q3",mod:"trauma",lesson:"tr-3",scope:"AP",prompt:"Which obstetric category remains a TXA indication in the update?",
  options:["Ectopic pregnancy","Placenta praevia","Postpartum haemorrhage","Miscarriage"],answer:2,
  explain:"Postpartum haemorrhage is now the only obstetric TXA indication. Removal from the other algorithms does not remove the need for urgent haemorrhage care.",src:"Circular rows 22–25, 29 · Summary p.4"},
 {id:"Q4",mod:"trauma",lesson:"tr-5",scope:"AP",prompt:"Which newly included finding must be checked against the trauma bypass criteria?",
  options:["Abdominal seat belt sign","Any mild isolated finger pain","The vehicle's colour"],answer:0,
  explain:"The abdominal seat belt sign is newly included. The complete destination decision still follows CPG 10.10.",src:"CPG 10.10 · Circular row 19"},
 {id:"Q5",mod:"trauma",lesson:"tr-6",scope:"AP",prompt:"A patient has neurogenic shock from a spinal cord injury and is also bleeding from a pelvic injury. Which MAP target applies?",
  options:["MAP 85–90 mmHg","MAP ≥65 mmHg","No target; avoid fluids completely"],answer:1,
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
  explain:"Hard neurological signs (loss of motor and sensory function) mean rapid extrication with gentle handling. Soft signs such as non-dermatomal tingling don't rule out self-extrication.",src:"CPG 10.13 p.200"},
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

/* ---------- Icebreaker "Still true or changed?": ungraded, instant reveal. Each statement is a v2.5 habit, checked against v2.5 and v2.6 ---------- */
const TC=["Still true in v2.6","Changed in v2.6"];
const DQ=[
 {id:"D1",mod:"trauma",prompt:"“APs give TXA to adults only, not to children.”",options:TC,answer:1,
  explain:"APs can now give TXA to children (under 14) with major trauma less than 3 hours old and suspected or confirmed major haemorrhage, or TBI with GCS ≤12. Covered in Module 1.",src:"Formulary TXA p.392 · Circular rows 12–20, 27–28"},
 {id:"D2",mod:"trauma",prompt:"“Ejection (partial or complete) from a vehicle meets the trauma bypass criteria.”",options:TC,answer:0,
  explain:"Still a bypass criterion. What's new in CPG 10.10 is the abdominal seat belt sign. Covered in Module 1.",src:"CPG 10.10 p.194 · Circular row 19"},
 {id:"D3",mod:"trauma",prompt:"“TXA is given for antepartum bleeding from a placental abruption.”",options:TC,answer:1,
  explain:"TXA was removed from the ectopic, miscarriage, abruption and praevia algorithms. Post-partum haemorrhage is now the only obstetric indication. Covered in Module 1.",src:"Formulary TXA p.392 · Circular rows 22–25, 29"},
 {id:"D4",mod:"newborn",prompt:"“Meconium-stained liquor on its own is a reason to suction the newborn.”",options:TC,answer:1,
  explain:"Suction is now only for airway obstruction, done under direct vision. Meconium alone is no longer a reason to suction. Covered in Module 2.",src:"CPG 2.5 p.51"},
 {id:"D5",mod:"newborn",prompt:"“If a newborn needs suction, suction the mouth first, then the nose.”",options:TC,answer:0,
  explain:"Unchanged: mouth first, then nose. What changed is when suction is used. Covered in Module 2.",src:"CPG 2.5 p.51"},
 {id:"D6",mod:"cardiac",prompt:"“Adult shockable arrest: the first amiodarone dose (300 mg) is given after the 3rd shock.”",options:TC,answer:0,
  explain:"Unchanged: 300 mg after the 3rd shock. Other parts of the arrest algorithm did change. Covered in Module 3.",src:"CPG 2.1 p.35"},
 {id:"D7",mod:"cardiac",prompt:"“Adult broad-complex synchronised cardioversion starts at 200 J.”",options:TC,answer:1,
  explain:"It now starts at 150 J, with stepwise escalation if needed. Covered in Module 3.",src:"CPG 4.3 p.77"},
 {id:"D8",mod:"stroke",prompt:"“A BEFAST-positive patient with symptom onset under 15 hours goes P1 to HGH ED.”",options:TC,answer:1,
  explain:"The 15-hour cut-off is gone. Onset up to 8 hours: P1 to HGH ED. Between 8 and 24 hours: do a RACE score. RACE ≥5: P1 to HGH ED. RACE <5: P2 to the nearest appropriate ED. Covered in Module 4.",src:"CPG 3.1 p.64"},
 {id:"D9",mod:"stroke",prompt:"“A wake-up stroke is treated as an acute stroke and transported P1.”",options:TC,answer:0,
  explain:"Unchanged. Wake-up or unknown-onset stroke is still treated as acute: P1 to HGH ED with prenotification. Covered in Module 4.",src:"CPG 3.1 p.64"}
];

