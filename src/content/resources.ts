export interface DownloadResource {
  id: string;
  title: string;
  description: string;
  category: string;
  pdf: string;
  pptx: string;
  pages: number;
  slides: number;
  reviewedDate: string;
}

const items = [
  ['nursing-foundations', 'Nursing Foundations', 'ADPIE, safety, communication, delegation, mobility, and essential bedside priorities.', 'Foundations'],
  ['pharmacology-basics', 'Pharmacology Basics', 'Medication classes, safety checks, monitoring, adverse-effect clues, and patient teaching.', 'Pharmacology'],
  ['medical-surgical-overview', 'Medical-Surgical Nursing Overview', 'A systems-first map of adult assessment, common risks, and priority escalation.', 'Adult Health'],
  ['health-assessment', 'Health Assessment', 'A clear head-to-toe sequence with expected, unexpected, and urgent findings.', 'Assessment'],
  ['dosage-calculations', 'Dosage Calculations', 'Conversions, desired-over-have, weight-based dosing, IV rates, and safe rounding.', 'Dosage Math'],
  ['maternal-newborn', 'Maternal and Newborn Nursing', 'Prenatal, labor, postpartum, and newborn recognition and safety priorities.', 'Maternal-Newborn'],
  ['pediatric-nursing', 'Pediatric Nursing', 'Development, family-centered assessment, medication safety, and deterioration cues.', 'Pediatrics'],
  ['mental-health-nursing', 'Mental Health Nursing', 'Therapeutic communication, crisis safety, major disorders, and medication monitoring.', 'Mental Health'],
  ['nclex-prioritization', 'NCLEX Prioritization', 'Client Needs, clinical judgment, priority ladders, delegation, and question strategy.', 'NCLEX'],
  ['laboratory-values', 'Laboratory Values', 'Trend-based review of CBC, chemistry, electrolytes, renal clues, and critical communication.', 'Labs'],
  ['isolation-precautions', 'Isolation Precautions', 'Standard, contact, droplet, airborne, PPE, equipment, and transport concepts.', 'Infection Prevention'],
  ['medication-safety', 'Medication Safety', 'The medication-use process, error prevention, high-alert checks, and teach-back.', 'Pharmacology'],
] as const;

export const downloadResources: DownloadResource[] = items.map(([id, title, description, category]) => ({
  id, title, description, category,
  pdf: `/downloads/guides/${id}.pdf`,
  pptx: `/downloads/presentations/${id}.pptx`,
  pages: 9,
  slides: 10,
  reviewedDate: '2026-07-13',
}));

/**
 * The lesson groups that feed each generated guide and presentation.
 * Keeping these IDs beside the resource catalog makes broken content links
 * visible to the regular content verifier instead of silently falling back to
 * an unrelated lesson during artifact generation.
 */
export const resourceLessonMap: Record<string, string[]> = {
  'nursing-foundations': [
    'foundations-clinical-judgment',
    'foundations-safety-fall-prevention',
    'foundations-documentation-sbar',
    'foundations-delegation-prioritization',
    'foundations-mobility-positioning',
  ],
  'pharmacology-basics': [
    'pharmacology-high-yield-classes-monitoring',
    'foundations-medication-administration-safety',
    'adult-13-diabetes-insulin-safety',
    'dosage-calculation-foundations-safe-rounding',
  ],
  'medical-surgical-overview': [
    'adult-11-cardiovascular-heart-failure',
    'adult-12-respiratory-oxygenation',
    'adult-14-renal-acute-kidney-injury',
    'adult-17-neurologic-stroke',
    'adult-18-gi-perioperative',
    'adult-19-shock-sepsis',
  ],
  'health-assessment': [
    'foundations-head-to-toe-assessment',
    'foundations-vital-signs-pain',
    'adult-11-cardiovascular-heart-failure',
    'adult-12-respiratory-oxygenation',
    'adult-17-neurologic-stroke',
  ],
  'dosage-calculations': [
    'dosage-calculation-foundations-safe-rounding',
    'foundations-medication-administration-safety',
  ],
  'maternal-newborn': ['maternal-newborn-priorities'],
  'pediatric-nursing': ['pediatric-growth-assessment-medication-safety'],
  'mental-health-nursing': ['mental-health-communication-suicide-safety'],
  'nclex-prioritization': [
    '2026-nclex-pn-clinical-judgment-prioritization',
    'foundations-delegation-prioritization',
    'emergency-critical-care-first-priorities',
  ],
  'laboratory-values': [
    'adult-15-fluids-electrolytes',
    'adult-16-acid-base-abg',
    'adult-14-renal-acute-kidney-injury',
    'adult-13-diabetes-insulin-safety',
  ],
  'isolation-precautions': [
    'foundations-infection-control-isolation',
    'foundations-safety-fall-prevention',
  ],
  'medication-safety': [
    'foundations-medication-administration-safety',
    'pharmacology-high-yield-classes-monitoring',
    'dosage-calculation-foundations-safe-rounding',
  ],
};
