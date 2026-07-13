import { sources } from './sources';
import type { QuickSheet } from './types';

const sheet = (
  id: string,
  title: string,
  category: string,
  description: string,
  accent: string,
  sections: QuickSheet['sections'],
  source: QuickSheet['source'] = sources.nclexPn,
): QuickSheet => ({
  id,
  title,
  category,
  description,
  accent,
  sections,
  reviewedDate: '2026-07-13',
  source,
  downloadPath: `/downloads/quick-sheets/${id}.pdf`,
});

export const quickSheets: QuickSheet[] = [
  sheet('vital-signs', 'Adult Vital Signs at a Glance', 'Assessment', 'Resting adult reference points plus the assessment cues that matter more than one isolated number.', '#38d6c5', [
    { heading: 'Common resting reference points', points: ['Pulse: 60-100/min', 'Respirations: 12-18/min', 'Blood pressure: roughly 90/60 to below 120/80 mm Hg', 'Temperature varies by route, time, and person; trend against baseline'] },
    { heading: 'Check the context', points: ['Age, activity, pain, anxiety, medications, posture, and illness affect readings.', 'Choose the correct cuff and site.', 'Recheck an unexpected value manually when appropriate.'] },
    { heading: 'Escalate the pattern', points: ['New symptoms plus an abnormal trend outrank a lone number.', 'Airway, breathing, circulation, mental-status, and perfusion changes require prompt attention.', 'Follow course and facility notification parameters.'] },
  ], sources.medlineVitalSigns),
  sheet('common-labs', 'Common Laboratory Values', 'Labs', 'High-yield adult reference ranges with an explicit reminder that laboratories and client factors vary.', '#6e7cff', [
    { heading: 'CBC landmarks', points: ['WBC, hemoglobin, hematocrit, and platelet ranges vary by lab, age, sex, pregnancy, and altitude.', 'Interpret trends and symptoms, not a memorized number alone.', 'Verify the exact report range before acting.'] },
    { heading: 'Chemistry landmarks', points: ['Sodium, potassium, glucose, BUN, creatinine, and bicarbonate help frame fluid, renal, metabolic, and acid-base status.', 'Hemolysis can falsely change some results, especially potassium.', 'Critical values require read-back and policy-based escalation.'] },
    { heading: 'Memory frame', points: ['CBC = cells.', 'BMP/CMP = chemistry and organ clues.', 'Coagulation tests = clotting pathway and medication monitoring context.'] },
  ], sources.medlineElectrolytes),
  sheet('electrolytes', 'Electrolyte Imbalances', 'Labs', 'Notice the direction, connect it to symptoms, and protect the heart and brain while escalating.', '#f29c6b', [
    { heading: 'Potassium', points: ['Low or high potassium can disturb cardiac rhythm and muscle function.', 'Check renal status, GI losses, medications, and ECG context.', 'Never treat a number without verifying the result and order.'] },
    { heading: 'Sodium', points: ['Sodium disorders commonly show neurologic changes because water shifts affect the brain.', 'Track fluid balance, weight, intake/output, and trend.', 'Correction rate is a provider-managed safety issue; avoid rapid unplanned changes.'] },
    { heading: 'Calcium and magnesium', points: ['Low levels can increase neuromuscular irritability.', 'High levels can reduce reflexes or alertness.', 'Watch respiratory, cardiac, and seizure safety cues.'] },
  ], sources.medlineElectrolytes),
  sheet('insulin-families', 'Insulin Families and Safety', 'Pharmacology', 'A class-level memory aid; always verify the exact product label, meal plan, order, and facility policy.', '#9c7bff', [
    { heading: 'Timing families', points: ['Rapid-acting: begins quickly and is linked closely to food availability.', 'Short-acting: slower onset and a more visible peak.', 'Intermediate: cloudier suspension for some products; has a meaningful peak.', 'Long/ultra-long: basal coverage with little or no pronounced peak.'] },
    { heading: 'Safety sequence', points: ['Check glucose, symptoms, nutrition status, exact product, dose, and timing.', 'Use the correct device and independent check when required.', 'Know the local hypoglycemia plan before giving insulin.'] },
    { heading: 'Hypoglycemia clues', points: ['Sweating, tremor, hunger, palpitations, behavior change, confusion, or reduced consciousness.', 'Confirm when possible without delaying emergency care.', 'Treat and recheck only according to the approved protocol.'] },
  ], sources.ahrqMedication),
  sheet('medication-suffixes', 'Medication Name Patterns', 'Pharmacology', 'Suffixes are study clues, not proof of a drug class or a substitute for checking the label.', '#5bb7ff', [
    { heading: 'Cardiovascular clues', points: ['-pril often signals an ACE inhibitor.', '-sartan often signals an ARB.', '-olol often signals a beta blocker.', '-dipine often signals a dihydropyridine calcium-channel blocker.'] },
    { heading: 'Other common clues', points: ['-statin: lipid-lowering statin.', '-prazole: proton-pump inhibitor.', '-cillin: penicillin-family antibiotic.', '-gliptin: DPP-4 diabetes medication.'] },
    { heading: 'Use the clue safely', points: ['Confirm generic name, indication, route, dose, and allergies.', 'Look-alike names can cross class boundaries.', 'Use an approved drug reference for monitoring and teaching.'] },
  ], sources.fdaMedication),
  sheet('antidotes', 'Common Reversal and Rescue Associations', 'Pharmacology', 'Exam-focused associations only; real use depends on the agent, timing, client, protocol, and prescriber.', '#ff7d8e', [
    { heading: 'Frequently tested pairs', points: ['Opioids - naloxone.', 'Benzodiazepines - flumazenil in selected situations.', 'Heparin - protamine.', 'Warfarin - vitamin K; urgent reversal may require additional products.', 'Acetaminophen - N-acetylcysteine.'] },
    { heading: 'Important cautions', points: ['Reversal can uncover pain, withdrawal, seizures, thrombosis, or recurrent toxicity.', 'Some antidotes have narrow indications and monitoring needs.', 'Call poison control/rapid response/emergency services per setting.'] },
    { heading: 'Exam approach', points: ['Identify the agent.', 'Protect airway, breathing, and circulation.', 'Stop exposure and escalate.', 'Then connect the approved antidote and monitoring.'] },
  ], sources.fdaMedication),
  sheet('isolation-precautions', 'Isolation Precautions', 'Infection prevention', 'Start with Standard Precautions, then add transmission-based measures from the current sign and policy.', '#39c7a7', [
    { heading: 'Contact', points: ['Gown and gloves when room-entry policy/interaction requires them.', 'Dedicate or disinfect equipment.', 'Contain contaminated items and perform hand hygiene.'] },
    { heading: 'Droplet', points: ['Medical mask for close respiratory exposure as directed.', 'Mask the client for necessary transport when tolerated.', 'Special air handling is generally not required.'] },
    { heading: 'Airborne', points: ['Use an airborne infection isolation room when required.', 'Wear a fit-tested respirator according to policy.', 'Keep the door closed and limit transport.'] },
  ], sources.cdcIsolation),
  sheet('cranial-nerves', 'Cranial Nerves', 'Neuro', 'A function-first map for focused neurologic assessment.', '#7b88ff', [
    { heading: 'Sensory', points: ['I smell.', 'II vision and visual fields.', 'VIII hearing and balance.'] },
    { heading: 'Eye and face', points: ['III, IV, VI eye movement; III also pupil response and eyelid elevation.', 'V facial sensation and chewing.', 'VII facial movement and taste.'] },
    { heading: 'Swallow, voice, and movement', points: ['IX/X swallow, palate, voice, gag context.', 'XI shoulder shrug and head turn.', 'XII tongue movement.', 'Compare sides and connect findings to the overall neuro picture.'] },
  ]),
  sheet('heart-lung-sounds', 'Heart and Lung Sound Clues', 'Assessment', 'Use location, timing, quality, symmetry, symptoms, and trend together.', '#3cc9df', [
    { heading: 'Heart landmarks', points: ['S1 marks closure at the start of systole; S2 marks closure at the end.', 'Extra sounds or murmurs require context and trained assessment.', 'Apical rate and rhythm help verify an irregular peripheral pulse.'] },
    { heading: 'Lung landmarks', points: ['Crackles: discontinuous popping, often linked with fluid or reopening airways.', 'Wheezes: musical narrowing clue.', 'Stridor: upper-airway emergency clue.', 'Diminished/absent: consider poor air movement, obstruction, or other urgent causes.'] },
    { heading: 'Assess before naming', points: ['Compare side to side.', 'Note work of breathing, speech, color, cough, and oxygen data.', 'Escalate acute asymmetry, stridor, silence with distress, or rapid deterioration.'] },
  ]),
  sheet('rhythm-basics', 'Cardiac Rhythm First Look', 'Critical care', 'A safe rhythm-study sequence: client first, then rate, regularity, waves, intervals, and pattern.', '#ff9d66', [
    { heading: 'Six-step strip scan', points: ['Assess the client and pulse.', 'Estimate rate.', 'Check regularity.', 'Look for P waves.', 'Measure PR and QRS.', 'Name the pattern only after the evidence.'] },
    { heading: 'High-priority clues', points: ['No pulse changes the response completely.', 'New chest pain, hypotension, altered mental status, shock, or severe dyspnea signal instability.', 'Artifact can imitate a lethal rhythm; check leads and client without delaying emergency response.'] },
    { heading: 'Memory line', points: ['Treat the client, not the monitor.', 'A rhythm name is not a complete assessment.', 'Follow current resuscitation training and facility algorithms.'] },
  ]),
  sheet('acid-base', 'ABG Pattern Finder', 'Labs', 'Use pH, PaCO2, and bicarbonate direction to identify the primary pattern; clinical context determines the cause.', '#c77cff', [
    { heading: 'Reference frame', points: ['pH about 7.35-7.45.', 'PaCO2 about 35-45 mm Hg.', 'HCO3 about 22-26 mEq/L.', 'Use the reporting laboratory range.'] },
    { heading: 'Direction rules', points: ['Respiratory: pH and PaCO2 move opposite.', 'Metabolic: pH and HCO3 move together.', 'A value moving in the other system may show compensation.'] },
    { heading: 'Clinical anchors', points: ['Ventilation problems change CO2.', 'Renal/GI/metabolic problems change bicarbonate or acids.', 'Airway and breathing instability come before worksheet interpretation.'] },
  ], sources.medlineElectrolytes),
  sheet('gcs-neuro', 'Glasgow Coma Scale and Neuro Trend', 'Neuro', 'Trend eye, verbal, and motor responses using the same stimulus and documentation method.', '#648dff', [
    { heading: 'Three domains', points: ['Eye opening: 1-4.', 'Verbal response: 1-5.', 'Motor response: 1-6.', 'Total score: 3-15, but component scores tell more.'] },
    { heading: 'Document clearly', points: ['Record E, V, and M components, total, time, and stimulus.', 'Note intubation, sedation, language, hearing, paralysis, and baseline limits.', 'Avoid vague terms such as “stable neuro.”'] },
    { heading: 'Escalate change', points: ['A declining trend, new pupil difference, new weakness, seizure, or acute behavior change needs prompt assessment and escalation.', 'Protect airway and injury risk.', 'Check glucose and reversible factors per protocol.'] },
  ]),
  sheet('pain-scales', 'Pain Assessment Tools', 'Assessment', 'Match the tool to age, communication ability, cognition, and setting; reassessment completes the cycle.', '#f27592', [
    { heading: 'Self-report tools', points: ['Numeric rating scale for clients who can quantify pain.', 'Verbal descriptor scale when words fit better than numbers.', 'Faces scales can support selected children and adults.'] },
    { heading: 'Behavior tools', points: ['Use a validated behavioral scale when self-report is not possible.', 'Behavior does not prove absence or presence by itself.', 'Ask family about baseline expressions when appropriate.'] },
    { heading: 'PQRST plus function', points: ['Provokes/palliates, Quality, Region/radiation, Severity, Timing.', 'Add functional goal, associated symptoms, and safety risks.', 'Reassess after every intervention at the required interval.'] },
  ]),
  sheet('injection-sites', 'Injection Site Decision Guide', 'Clinical skills', 'Site and technique depend on route, medication, volume, age, tissue, device, and policy.', '#4dc6a5', [
    { heading: 'Subcutaneous', points: ['Use approved fatty-tissue sites.', 'Rotate sites for repeated injections.', 'Choose angle and skin fold for needle length and client tissue.'] },
    { heading: 'Intramuscular', points: ['Use an approved landmarked muscle and needle selected for client and medication.', 'Avoid injured, infected, scarred, or contraindicated areas.', 'Follow specific product guidance for site and technique.'] },
    { heading: 'Always', points: ['Verify route and formulation.', 'Use a safety-engineered needle/device.', 'Never recap; discard directly into sharps.', 'Check current school/facility policy.'] },
  ], sources.ahrqMedication),
  sheet('oxygen-devices', 'Oxygen Devices and Checks', 'Respiratory', 'Know the device family, assess the client, and never substitute a memorized flow range for the order and policy.', '#55baf0', [
    { heading: 'Common families', points: ['Nasal cannula: low-flow, allows talking/eating.', 'Simple or reservoir masks: fit and minimum-flow safety matter.', 'Venturi-style mask: controlled oxygen concentration.', 'High-flow systems: heated/humidified support with specific equipment.'] },
    { heading: 'Nursing checks', points: ['Airway, work of breathing, speech, mental status, color, and trend.', 'Correct device, fit, setting, tubing, humidification, and skin protection.', 'Fire safety and no petroleum-based products.'] },
    { heading: 'Escalate', points: ['New severe distress, cyanosis, reduced consciousness, silent chest, stridor, or unexpected deterioration.', 'Do not delay help while troubleshooting equipment.', 'Follow the prescribed target and protocol.'] },
  ]),
  sheet('iv-calculations', 'IV Calculation Formulas', 'Dosage math', 'A compact setup-and-unit checklist for pump, gravity, and completion-time problems.', '#6d7cff', [
    { heading: 'Pump', points: ['mL/hr = total mL / hours.', 'Convert minutes to a fraction of an hour before calculating.', 'Completion hours = remaining mL / mL/hr.'] },
    { heading: 'Gravity', points: ['gtt/min = (mL x drop factor) / total minutes.', 'Drop factor comes from the tubing package.', 'Round to whole drops unless instructed otherwise.'] },
    { heading: 'Safety check', points: ['Write units at every step.', 'Estimate before calculating.', 'Trace the line, verify concentration, pump library, and independent-check requirements.'] },
  ], sources.ahrqMedication),
  sheet('pediatric-milestones', 'Pediatric Milestone Study Map', 'Pediatrics', 'Milestones are ranges and patterns; screening and caregiver concerns matter more than a rigid birthday cutoff.', '#ffad68', [
    { heading: 'Infancy themes', points: ['Rapid motor progression from head control toward sitting and mobility.', 'Social smile, babble, and attachment behaviors emerge over time.', 'Safe sleep, feeding, growth, and immunization teaching are central.'] },
    { heading: 'Toddler/preschool themes', points: ['Language expands, play becomes more interactive, and independence grows.', 'Expect regression during illness or stress.', 'Use simple choices and concrete explanations.'] },
    { heading: 'School-age/adolescent themes', points: ['Peers, privacy, identity, and body changes gain importance.', 'Include the child in teaching at the right developmental level.', 'Report lost skills or significant delay concerns for evaluation.'] },
  ]),
  sheet('maternal-fetal', 'Maternal and Fetal Priority Cues', 'Maternal-newborn', 'A study sheet for recognizing urgent changes; follow current obstetric protocols and instructor guidance.', '#ef77a5', [
    { heading: 'Prenatal warning cues', points: ['Heavy bleeding, severe persistent headache, vision changes, seizure, chest pain, severe dyspnea, or markedly reduced fetal movement warrant prompt evaluation.', 'Check gestational context and baseline.', 'Avoid giving individualized advice from a study aid.'] },
    { heading: 'Labor framework', points: ['Assess fetal response, contraction pattern, maternal vital signs, pain/coping, membranes/fluid, and labor progress.', 'Reposition and escalation decisions follow the specific tracing, order, and protocol.', 'Communicate trends, not isolated data.'] },
    { heading: 'Postpartum/newborn', points: ['Heavy bleeding, uterine tone change, shock cues, severe pain, fever, or new neurologic symptoms are urgent.', 'For the newborn, airway/breathing, temperature, feeding, glucose risk, color, and behavior are key.', 'Use two-identifier and security procedures.'] },
  ]),
  sheet('priority-delegation', 'Prioritization and Delegation', 'NCLEX', 'A repeatable decision ladder for exam items and clinical communication.', '#4dc8b5', [
    { heading: 'Priority ladder', points: ['Immediate threats to airway, breathing, circulation, safety, or acute neurologic status.', 'Unstable before stable; acute/unexpected before chronic/expected.', 'Actual problems often before risk, unless the risk is immediate and catastrophic.'] },
    { heading: 'Delegation check', points: ['Right task, circumstance, person, direction/communication, supervision/evaluation.', 'Assessment, nursing judgment, teaching, and evaluation generally remain with the licensed nurse at the appropriate level.', 'Scope varies by role, state, and facility.'] },
    { heading: 'Question clue', points: ['Ask what can harm the client first.', 'Choose the least restrictive effective safety action.', 'If data are missing, assess before intervening unless delay is dangerous.'] },
  ], sources.nclexPn),
  sheet('communication-nclex', 'Therapeutic Communication + ADPIE', 'Foundations', 'Combine a safe conversation style with the nursing-process and clinical-judgment cycle.', '#8c7cff', [
    { heading: 'Therapeutic moves', points: ['Open-ended invitation, reflection, clarification, silence, validation, and focused exploration.', 'Acknowledge emotion before giving information.', 'Use teach-back without testing or shaming.'] },
    { heading: 'Avoid', points: ['False reassurance, “why” questions that sound blaming, advice-giving, topic changes, arguing, and promises you cannot keep.', 'Do not reinforce a delusion; respond to the feeling and present reality.', 'Do not keep safety threats secret.'] },
    { heading: 'ADPIE + judgment', points: ['Assess/recognize cues.', 'Diagnose or analyze cues and prioritize hypotheses.', 'Plan/generate solutions.', 'Implement/take action.', 'Evaluate outcomes and revise.'] },
  ], sources.ahrqTeam),
];

