import { sources } from './sources';
import type { ClinicalSkill } from './types';

const commonPrep = [
  'Verify the order or purpose, identify the client with two approved identifiers, and explain the skill.',
  'Perform hand hygiene, provide privacy, assess allergies and baseline status, and gather supplies.',
  'Check current school, facility, manufacturer, and instructor requirements before beginning.',
];

const commonSafety = [
  'Stop if the client develops distress or the situation is outside your scope; protect the client and escalate promptly.',
  'Use standard precautions and additional PPE based on anticipated exposure and transmission risk.',
  'Document what was done, the client response, and any communication or follow-up.',
];

const skill = (input: Omit<ClinicalSkill, 'preparation' | 'safetyCheckpoints' | 'source'> & {
  preparation?: string[];
  safetyCheckpoints?: string[];
  source?: ClinicalSkill['source'];
}): ClinicalSkill => ({
  ...input,
  preparation: input.preparation ?? commonPrep,
  safetyCheckpoints: [...commonSafety, ...(input.safetyCheckpoints ?? [])],
  source: input.source ?? sources.cdcCore,
});

export const clinicalSkills: ClinicalSkill[] = [
  skill({
    id: 'hand-hygiene', title: 'Hand hygiene', category: 'Infection prevention', minutes: 4,
    supplies: ['Alcohol-based hand rub or soap and water', 'Paper towels when using a sink'],
    steps: ['Remove barriers such as visibly soiled gloves.', 'Use alcohol-based rub in most routine clinical situations when hands are not visibly soiled.', 'Cover all hand and finger surfaces and rub until dry.', 'Use soap and water when hands are visibly soiled and when current policy requires it.', 'Avoid touching contaminated sink surfaces after cleaning.'],
    commonMistakes: ['Missing thumbs, fingertips, or between fingers', 'Using too little product', 'Putting gloves on before hands are dry'],
    documentationExample: 'Hand hygiene is usually not charted as a separate event; document education or an exception when clinically relevant.',
    patientTeaching: ['Invite clients to remind the team about clean hands.', 'Explain that gloves do not replace hand hygiene.'],
  }),
  skill({
    id: 'ppe', title: 'Personal protective equipment', category: 'Infection prevention', minutes: 7,
    supplies: ['Gown', 'Mask or respirator as indicated', 'Eye protection', 'Gloves'],
    steps: ['Review the isolation sign and anticipated task.', 'Perform hand hygiene.', 'Don the gown and secure it.', 'Apply mask or fit-tested respirator and eye protection as required.', 'Apply gloves last, covering gown cuffs.', 'Remove PPE in the designated area without touching contaminated surfaces.', 'Perform hand hygiene immediately after removal.'],
    commonMistakes: ['Choosing PPE from diagnosis alone instead of task and policy', 'Touching the face while wearing gloves', 'Skipping hand hygiene after removal'],
    documentationExample: 'Transmission-based precautions maintained; client and visitor education reinforced.',
    patientTeaching: ['Explain why each barrier is used.', 'Teach visitors to follow the posted sequence and ask for help.'],
  }),
  skill({
    id: 'sterile-field', title: 'Sterile field setup', category: 'Asepsis', minutes: 10,
    supplies: ['Sterile kit or drape', 'Ordered sterile supplies', 'Clean dry work surface', 'Required PPE'],
    steps: ['Clean and dry the work area and position supplies above waist level.', 'Check package integrity, expiration, and dryness.', 'Open the far flap first, then side flaps, then the near flap.', 'Treat the outer one-inch edge as contaminated unless product instructions differ.', 'Add supplies without reaching over the field.', 'Keep the field in constant view and replace it if sterility is uncertain.'],
    commonMistakes: ['Turning away from the field', 'Allowing moisture to strike through', 'Reaching across sterile contents'],
    documentationExample: 'Procedure completed using sterile technique; no break in sterility observed; client tolerated well.',
    patientTeaching: ['Ask the client not to touch or reach over the field.', 'Explain that the setup may be restarted if contamination is suspected.'],
  }),
  skill({
    id: 'vital-signs', title: 'Complete vital-sign set', category: 'Assessment', minutes: 8,
    supplies: ['Validated thermometer', 'Appropriate blood-pressure cuff', 'Watch or timer', 'Pulse oximeter when indicated'],
    steps: ['Assess factors that can change readings, including activity, pain, position, and recent intake.', 'Choose the correct equipment size and site.', 'Measure temperature using the approved route.', 'Assess pulse rate, rhythm, and strength.', 'Observe respirations without coaching the pattern.', 'Measure blood pressure with the limb supported and cuff correctly positioned.', 'Compare with baseline and report concerning trends.'],
    commonMistakes: ['Using the wrong cuff size', 'Rounding or estimating respirations', 'Responding to one value without reassessment or context'],
    documentationExample: 'T 37.0 C oral, HR 78 regular, RR 16 unlabored, BP 118/72 right arm seated; denies acute symptoms.',
    patientTeaching: ['Rest quietly before a blood-pressure check when possible.', 'Report dizziness, shortness of breath, chest discomfort, or new symptoms.'],
    source: sources.medlineVitalSigns,
  }),
  skill({
    id: 'head-to-toe', title: 'Head-to-toe assessment', category: 'Assessment', minutes: 20,
    supplies: ['Stethoscope', 'Penlight', 'Watch', 'Assessment tools required by the setting'],
    steps: ['Begin with general appearance, safety, pain, orientation, and immediate concerns.', 'Assess neurologic status and pupils.', 'Inspect breathing effort and auscultate lungs.', 'Assess heart sounds, pulses, perfusion, and edema.', 'Inspect and auscultate the abdomen before palpation when appropriate.', 'Assess skin, mobility, lines, tubes, wounds, and elimination needs.', 'Compare findings with baseline and organize follow-up by priority.'],
    commonMistakes: ['Following a checklist while missing client distress', 'Failing to compare sides or trends', 'Documenting before completing the assessment'],
    documentationExample: 'Alert and oriented, respirations even, lungs clear bilaterally, pulses palpable, abdomen soft with bowel sounds, skin intact; safety measures in place.',
    patientTeaching: ['Explain each step before touching.', 'Invite the client to identify changes from their usual baseline.'],
  }),
  skill({
    id: 'oral-medication', title: 'Oral medication administration', category: 'Medication safety', minutes: 12,
    supplies: ['Medication record', 'Unit-dose medications', 'Appropriate measuring device', 'Water if allowed'],
    steps: ['Review the order, indication, allergies, relevant assessment data, and hold parameters.', 'Compare the medication label with the record at required checkpoints.', 'Prepare one client’s medications at a time.', 'Identify the client with two approved identifiers and explain each medication.', 'Position safely and assess ability to swallow.', 'Remain until medications are taken; do not leave them unattended.', 'Document administration and evaluate expected and adverse effects.'],
    commonMistakes: ['Using room number as an identifier', 'Crushing a formulation without verification', 'Documenting before administration'],
    documentationExample: 'Scheduled medications administered per record after identification and allergy check; education provided; no immediate adverse response.',
    patientTeaching: ['State the name, purpose, and key precautions in plain language.', 'Encourage questions and respect the right to refuse while following notification policy.'],
    source: sources.ahrqMedication,
  }),
  skill({
    id: 'subcutaneous-injection', title: 'Subcutaneous injection concept check', category: 'Medication safety', minutes: 10,
    supplies: ['Ordered medication', 'Correct syringe/device', 'Antiseptic supplies', 'Sharps container'],
    steps: ['Verify the medication, concentration, dose, and device.', 'Select and inspect an approved site; rotate sites as required.', 'Clean the site according to policy and allow it to dry.', 'Use the technique, angle, and skin fold appropriate to the device and client.', 'Activate the safety feature and discard immediately in sharps.', 'Observe and document the site and client response.'],
    commonMistakes: ['Using an incompatible syringe', 'Failing to rotate sites', 'Recapping a used needle'],
    documentationExample: 'Medication administered subcutaneously in approved site; site intact; client tolerated procedure.',
    patientTeaching: ['Teach site rotation using a simple map.', 'Review safe sharps disposal for home use.'],
    source: sources.ahrqMedication,
  }),
  skill({
    id: 'iv-site', title: 'Peripheral IV site assessment', category: 'IV concepts', minutes: 6,
    supplies: ['Gloves as indicated', 'Facility-approved assessment scale', 'Dressing supplies if ordered and within scope'],
    steps: ['Trace the tubing from solution to client and verify labels and settings.', 'Inspect the site for redness, swelling, drainage, leaking, or streaking.', 'Palpate as permitted for tenderness, warmth, coolness, or a cordlike vein.', 'Ask about pain, burning, tightness, or numbness.', 'Assess infusion flow and downstream circulation.', 'Stop and escalate suspected complications according to policy.'],
    commonMistakes: ['Checking the pump but not the client', 'Ignoring new pain because fluid is still infusing', 'Flushing a site when infiltration or extravasation is suspected'],
    documentationExample: 'Peripheral IV site assessed; dressing clean/dry/intact, no redness, swelling, leaking, or pain; infusion running as ordered.',
    patientTeaching: ['Report burning, pain, wetness, swelling, or tightness immediately.', 'Avoid pulling or placing pressure on the line.'],
  }),
  skill({
    id: 'foley-care', title: 'Indwelling urinary catheter care', category: 'Elimination', minutes: 10,
    supplies: ['Clean gloves', 'Facility-approved cleansing supplies', 'Securement device'],
    steps: ['Confirm the catheter remains indicated and assess urine characteristics.', 'Perform hand hygiene and don gloves.', 'Clean from the urethral area outward using approved technique.', 'Keep the drainage system closed and tubing free of kinks.', 'Secure the catheter without tension.', 'Keep the bag below bladder level and off the floor.', 'Measure and obtain specimens only through approved ports and methods.'],
    commonMistakes: ['Breaking the closed system unnecessarily', 'Placing the bag on the bed or floor', 'Allowing dependent loops'],
    documentationExample: 'Catheter care completed; securement intact; drainage system closed, dependent, and unobstructed; urine clear yellow.',
    patientTeaching: ['Do not pull or disconnect the tubing.', 'Report lower abdominal pain, leaking, fever, or reduced drainage.'],
  }),
  skill({
    id: 'wound-care', title: 'Wound assessment and dressing change', category: 'Skin and wounds', minutes: 20,
    supplies: ['Ordered dressing supplies', 'Clean and sterile gloves as required', 'Measuring guide', 'Waste bag'],
    steps: ['Review the order, pain plan, allergies, and prior wound measurements.', 'Remove the old dressing using clean technique and assess drainage.', 'Perform hand hygiene and set up the ordered clean or sterile field.', 'Assess location, dimensions, tissue, edges, surrounding skin, drainage, odor, and pain.', 'Clean in the direction and with the solution required by policy/order.', 'Apply the ordered dressing without excess pressure.', 'Reposition, dispose of supplies, and reassess comfort.'],
    commonMistakes: ['Using inconsistent measurement methods', 'Documenting color or odor without objective descriptors', 'Packing tightly or leaving unaccounted packing material'],
    documentationExample: 'Sacral wound measured using facility method; tissue and drainage described; dressing changed per order; client tolerated with pain reassessed.',
    patientTeaching: ['Explain pressure relief, nutrition, moisture control, and warning signs.', 'Do not remove a specialty dressing unless directed.'],
    source: sources.ahrqPressure,
  }),
  skill({
    id: 'oxygen-device', title: 'Oxygen delivery device check', category: 'Respiratory', minutes: 7,
    supplies: ['Prescribed oxygen device', 'Pulse oximeter if ordered', 'Humidification if required by policy'],
    steps: ['Assess airway, breathing effort, mental status, skin color, and baseline oxygen data.', 'Verify the ordered device and setting.', 'Apply the device with correct fit while protecting skin.', 'Reassess the client, not only the monitor.', 'Confirm tubing is connected, unobstructed, and away from ignition sources.', 'Escalate worsening distress or an unexpected response immediately.'],
    commonMistakes: ['Treating the saturation number without assessing the client', 'Changing a prescribed setting outside authority', 'Ignoring skin pressure from tubing'],
    documentationExample: 'Oxygen delivered via ordered device/settings; respiratory effort and saturation reassessed; skin protected; response documented.',
    patientTeaching: ['Keep oxygen away from flames, smoking, heat, and petroleum products.', 'Call for help before removing the device if short of breath.'],
  }),
  skill({
    id: 'suctioning-concepts', title: 'Airway suctioning safety concepts', category: 'Respiratory', minutes: 12,
    supplies: ['Ordered suction setup', 'Appropriate catheter or closed system', 'Required PPE', 'Oxygen and monitoring equipment as indicated'],
    steps: ['Confirm indication and assess breath sounds, work of breathing, secretions, and oxygenation.', 'Explain the procedure and position the client.', 'Set up the required clean or sterile system.', 'Pre-oxygenate only when ordered or required by protocol.', 'Apply suction only as trained and limit each pass per policy.', 'Allow recovery between passes and reassess continuously.', 'Stop for significant distress and escalate.'],
    commonMistakes: ['Suctioning on a schedule without assessment', 'Using excessive pressure or duration', 'Failing to reassess after the procedure'],
    documentationExample: 'Suction performed for audible/visible secretions per protocol; secretions described; respiratory status improved and reassessed.',
    patientTeaching: ['Explain that coughing and short rest periods may be needed.', 'Use the call light if secretions or breathing worsen.'],
  }),
  skill({
    id: 'blood-glucose', title: 'Point-of-care blood glucose', category: 'Endocrine', minutes: 7,
    supplies: ['Approved meter and strip', 'Single-use lancet', 'Gloves', 'Sharps container'],
    steps: ['Verify meter quality checks and strip expiration.', 'Identify the client and explain the test.', 'Perform hand hygiene, don gloves, and choose an approved site.', 'Obtain the specimen without excessive squeezing.', 'Apply blood as the device instructs and read the result.', 'Act on critical or unexpected results per policy and assess symptoms.', 'Dispose of the lancet and clean the device as required.'],
    commonMistakes: ['Testing contaminated fingers', 'Ignoring an implausible value', 'Sharing a lancing device'],
    documentationExample: 'Point-of-care glucose obtained using approved device; result documented and addressed per protocol; symptoms assessed.',
    patientTeaching: ['Wash and dry hands before home testing.', 'Know the personal action plan for low or high readings.'],
  }),
  skill({
    id: 'transfer', title: 'Bed-to-chair transfer', category: 'Mobility', minutes: 10,
    supplies: ['Non-slip footwear', 'Gait belt if appropriate', 'Transfer aid as assessed', 'Second staff member when required'],
    steps: ['Assess strength, cognition, weight-bearing status, dizziness, lines, and required assistance.', 'Lock the bed and chair and clear the path.', 'Apply footwear and transfer device correctly.', 'Dangle and reassess tolerance before standing.', 'Use a wide base, neutral spine, and coordinated count.', 'Pivot with the feet; do not twist or pull the client’s arms.', 'Lower in a controlled manner and place safety items within reach.'],
    commonMistakes: ['Guessing the assistance level', 'Leaving wheels unlocked', 'Catching a falling client instead of using the trained fall response'],
    documentationExample: 'Transferred bed to chair with gait belt and one-person assist; tolerated without dizziness; chair locked and call light in reach.',
    patientTeaching: ['Move on the count and avoid grabbing around the helper’s neck.', 'Report dizziness or weakness before standing.'],
  }),
  skill({
    id: 'fall-prevention', title: 'Fall-risk safety round', category: 'Safety', minutes: 5,
    supplies: ['Approved fall-risk tool', 'Mobility aid', 'Bed/chair alarm if ordered and appropriate'],
    steps: ['Reassess fall risk after changes in condition, medication, mobility, or environment.', 'Place bed low and locked; ensure footwear and path are safe.', 'Keep call light, personal items, glasses, and mobility aids within reach.', 'Address pain, toileting, position, and possessions during rounds.', 'Use individualized assistance and alarm plans.', 'Communicate risk and interventions during handoff.'],
    commonMistakes: ['Relying on a wristband or alarm alone', 'Leaving clutter or cords in the path', 'Failing to update the plan after a near fall'],
    documentationExample: 'Fall risk reassessed; individualized precautions in place; toileting offered; client instructed to call before rising.',
    patientTeaching: ['Call before standing, even if you usually walk independently.', 'Sit at the bedside first and report dizziness.'],
  }),
  skill({
    id: 'sbar', title: 'SBAR clinical communication', category: 'Communication', minutes: 6,
    supplies: ['Current chart and medication record', 'Recent assessment and trend data', 'Pen or secure note tool'],
    steps: ['Situation: state your name/role, client, immediate concern, and urgency.', 'Background: give only relevant diagnosis, events, medications, allergies, and baseline.', 'Assessment: report focused findings, trends, and what you think is changing within your scope.', 'Recommendation/Request: state what you need, such as evaluation, order clarification, or transfer.', 'Read back critical information and clarify next steps.', 'Document the communication and response according to policy.'],
    commonMistakes: ['Giving a long history before the urgent issue', 'Reporting numbers without trend or symptoms', 'Ending without a clear request and read-back'],
    documentationExample: 'Provider notified via SBAR of new change in status; assessment data and trends reported; orders/read-back and response documented.',
    patientTeaching: ['Tell the team what feels different from normal.', 'Use teach-back to confirm the next-step plan.'],
    source: sources.ahrqTeam,
  }),
  skill({
    id: 'documentation', title: 'Objective clinical documentation', category: 'Communication', minutes: 8,
    supplies: ['Authorized electronic or paper health record', 'Current assessment data'],
    steps: ['Chart as soon as practical after care.', 'Use objective, specific, approved language and units.', 'Record assessment, intervention, client response, education, and communication.', 'Use quotation marks for relevant client statements.', 'Correct errors using the approved audit-preserving method.', 'Protect privacy and log out or secure the record.'],
    commonMistakes: ['Copying forward without verification', 'Using blame, judgment, or vague words', 'Charting care before it occurs'],
    documentationExample: 'Client states, “I feel light-headed when I stand.” Assisted back to bed; vital signs obtained; fall precautions reinforced; RN notified.',
    patientTeaching: ['Explain that accurate records support team communication.', 'Avoid discussing protected information in public areas.'],
    source: sources.ahrqTeam,
  }),
  skill({
    id: 'pain-assessment', title: 'Pain assessment and reassessment', category: 'Assessment', minutes: 7,
    supplies: ['Age- and ability-appropriate pain scale', 'Current care plan and medication record'],
    steps: ['Ask the client’s preferred description and goal.', 'Assess location, onset, quality, intensity, pattern, aggravating/relieving factors, and associated symptoms.', 'Observe behavioral and physiologic cues without treating them as a substitute for self-report.', 'Screen for urgent causes and safety risks.', 'Apply ordered pharmacologic and nonpharmacologic measures within scope.', 'Reassess at the appropriate interval and document response.'],
    commonMistakes: ['Using intensity alone', 'Assuming no pain because the client appears calm', 'Giving an intervention without reassessment'],
    documentationExample: 'Reports incisional pain 6/10, aching with movement; intervention provided per plan; reassessed at required interval, now 3/10 and resting.',
    patientTeaching: ['Report pain early and describe what makes it better or worse.', 'Discuss realistic functional goals, such as coughing or walking safely.'],
  }),
  skill({
    id: 'specimen', title: 'Clean-catch urine specimen', category: 'Diagnostics', minutes: 8,
    supplies: ['Labeled sterile container', 'Cleansing supplies', 'Gloves', 'Specimen bag'],
    steps: ['Verify the test and collection requirements before starting.', 'Label according to policy using approved identifiers.', 'Explain midstream collection and provide privacy.', 'Perform perineal cleansing using the provided instructions.', 'Begin voiding, then collect the midstream sample without touching the container interior.', 'Close, bag, and transport promptly using required storage conditions.'],
    commonMistakes: ['Collecting the first urine stream', 'Touching the inside of the cup or lid', 'Leaving an unlabeled specimen in the room'],
    documentationExample: 'Clean-catch urine specimen collected, labeled at bedside, and sent to laboratory per protocol.',
    patientTeaching: ['Start urinating before moving the cup into the stream.', 'Do not place tissue or other material in the container.'],
  }),
  skill({
    id: 'checkoff-prep', title: 'Clinical skills checkoff routine', category: 'Student success', minutes: 15,
    supplies: ['Instructor rubric', 'Required skill supplies', 'Practice partner or simulation station'],
    preparation: ['Read the exact school rubric and highlight automatic-fail safety steps.', 'Practice saying verification, assessments, and safety checks aloud.', 'Arrange supplies in the order of use and rehearse recovery from a contamination or interruption.'],
    steps: ['Introduce yourself and verify the simulated order.', 'Identify the client and allergies.', 'Explain, provide privacy, and perform hand hygiene.', 'Complete the skill in the rubric sequence while narrating critical checks.', 'Reassess the client and restore safety.', 'Document or verbalize documentation.', 'Self-grade immediately and repeat missed steps.'],
    commonMistakes: ['Memorizing hand motions without clinical reasoning', 'Continuing after a break in sterility', 'Forgetting reassessment and documentation'],
    documentationExample: 'Practice note: completed full sequence; repeat needed for supply setup and final reassessment.',
    patientTeaching: ['Use plain language even in simulation.', 'Invite questions and check understanding.'],
  }),
];

