import type { CaseStudy } from './types';

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-sepsis',
    title: 'The quiet change',
    setting: 'Long-term care to emergency transfer',
    client: 'An older adult with a new urinary complaint and a baseline history of mild memory loss.',
    unfolding: [
      {
        stage: 'Recognize cues',
        update: 'The client is newly drowsy, breathing faster than baseline, has cool skin, and needs more help standing.',
        question: 'Which findings are most important to cluster?',
        choices: ['New mental-status change', 'Faster breathing', 'Cool skin/weakness', 'Favorite television program'],
        correct: [0, 1, 2],
        rationale: 'Acute neurologic, respiratory, and perfusion changes form a deterioration pattern; preferences do not explain it.',
      },
      {
        stage: 'Prioritize hypotheses',
        update: 'Blood pressure is lower than the client’s usual trend and the pulse is faster. Infection is suspected.',
        question: 'What concern takes priority?',
        choices: ['Normal aging', 'Sepsis with impaired perfusion', 'Routine sleepiness', 'A chronic skin condition'],
        correct: [1],
        rationale: 'Suspected infection plus acute organ/perfusion changes raises a time-sensitive sepsis concern.',
      },
      {
        stage: 'Take action',
        update: 'The client remains confused and hypotensive.',
        question: 'Which nursing actions belong first?',
        choices: ['Activate urgent evaluation/response per protocol', 'Perform focused ABC and perfusion assessment', 'Wait for the next scheduled round', 'Offer unassisted ambulation'],
        correct: [0, 1],
        rationale: 'Immediate assessment and escalation protect the client while the interprofessional team evaluates and treats the cause.',
      },
    ],
  },
  {
    id: 'case-postpartum',
    title: 'More than expected',
    setting: 'Postpartum unit',
    client: 'A client several hours after birth who reports increasing weakness and feeling faint.',
    unfolding: [
      {
        stage: 'Recognize cues',
        update: 'The pad is rapidly saturating, pulse is rising, skin is pale, and the client feels dizzy.',
        question: 'Which cues are urgent?',
        choices: ['Rapid bleeding', 'Rising pulse', 'Pallor and dizziness', 'Request for water'],
        correct: [0, 1, 2],
        rationale: 'Bleeding plus circulatory symptoms suggests impaired perfusion and requires immediate response.',
      },
      {
        stage: 'Analyze and act',
        update: 'The client becomes more light-headed when trying to sit up.',
        question: 'Which actions are appropriate now?',
        choices: ['Keep the client safe and assess ABC/perfusion', 'Call for immediate obstetric assistance per protocol', 'Allow the client to walk to the bathroom alone', 'Delay reassessment until routine vital signs'],
        correct: [0, 1],
        rationale: 'Safety, focused assessment, and urgent escalation are priorities; standing or delay could worsen harm.',
      },
      {
        stage: 'Evaluate outcomes',
        update: 'The response team arrives and interventions begin.',
        question: 'Which trends best show response?',
        choices: ['Mental status and dizziness', 'Pulse and blood-pressure trend', 'Bleeding amount and uterine findings', 'Hair and eye color'],
        correct: [0, 1, 2],
        rationale: 'Neurologic, circulatory, and bleeding trends directly reflect perfusion and control of the problem.',
      },
    ],
  },
  {
    id: 'case-pediatric-breathing',
    title: 'Work of breathing',
    setting: 'Pediatric urgent assessment',
    client: 'A young child with cough whose caregiver says, “This breathing looks different.”',
    unfolding: [
      {
        stage: 'Recognize cues',
        update: 'The child has nasal flaring, intercostal retractions, fewer words per breath, and decreased interest in play.',
        question: 'Which cues indicate increased work of breathing?',
        choices: ['Nasal flaring', 'Retractions', 'Short speech', 'Reduced activity', 'Shoe color'],
        correct: [0, 1, 2, 3],
        rationale: 'Breathing effort, speech, and behavior changes are meaningful pediatric respiratory cues.',
      },
      {
        stage: 'Prioritize action',
        update: 'Breath sounds become very quiet and the child appears tired.',
        question: 'What is the priority interpretation?',
        choices: ['The child is improving because wheezing is quieter', 'Air movement may be worsening and fatigue is developing', 'The child only needs distraction', 'This is an expected nap'],
        correct: [1],
        rationale: 'A quiet chest with fatigue can signal poor air movement, not improvement, and requires urgent escalation.',
      },
      {
        stage: 'Respond and evaluate',
        update: 'The team initiates the ordered respiratory support plan.',
        question: 'Which data should the nurse trend?',
        choices: ['Work of breathing and breath sounds', 'Mental status and ability to speak', 'Oxygenation and vital-sign trend', 'Favorite toy'],
        correct: [0, 1, 2],
        rationale: 'Respiratory effort, ventilation clues, oxygenation, and behavior show whether the child is improving or tiring.',
      },
    ],
  },
];

