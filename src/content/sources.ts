import type { SourceLink } from './types';

export const sources = {
  cdcCore: {
    title: 'Core Infection Prevention and Control Practices',
    organization: 'Centers for Disease Control and Prevention',
    url: 'https://www.cdc.gov/infection-control/hcp/core-practices/index.html',
    reviewed: '2026-07-13',
  },
  cdcIsolation: {
    title: 'Precautions to Prevent Transmission of Infectious Agents',
    organization: 'Centers for Disease Control and Prevention',
    url: 'https://www.cdc.gov/infection-control/hcp/isolation-precautions/precautions.html',
    reviewed: '2026-07-13',
  },
  medlineVitalSigns: {
    title: 'Vital signs',
    organization: 'MedlinePlus, U.S. National Library of Medicine',
    url: 'https://medlineplus.gov/ency/article/002341.htm',
    reviewed: '2026-07-13',
  },
  medlineElectrolytes: {
    title: 'Electrolyte Panel',
    organization: 'MedlinePlus, U.S. National Library of Medicine',
    url: 'https://medlineplus.gov/lab-tests/electrolyte-panel/',
    reviewed: '2026-07-13',
  },
  nclexPn: {
    title: '2026 NCLEX-PN Test Plan',
    organization: 'National Council of State Boards of Nursing',
    url: 'https://www.ncsbn.org/publications/2026-nclex-pn-test-plan',
    reviewed: '2026-07-13',
  },
  ahrqTeam: {
    title: 'TeamSTEPPS Tools',
    organization: 'Agency for Healthcare Research and Quality',
    url: 'https://www.ahrq.gov/teamstepps-program/resources/modules/index.html',
    reviewed: '2026-07-13',
  },
  ahrqMedication: {
    title: 'Medication Administration Errors',
    organization: 'AHRQ Patient Safety Network',
    url: 'https://psnet.ahrq.gov/primer/medication-administration-errors',
    reviewed: '2026-07-13',
  },
  ahrqPressure: {
    title: 'Pressure Injury Prevention in Hospitals Training Program',
    organization: 'Agency for Healthcare Research and Quality',
    url: 'https://www.ahrq.gov/patient-safety/settings/hospital/resource/pressure-injury/index.html',
    reviewed: '2026-07-13',
  },
  fdaMedication: {
    title: 'Medication Errors Related to CDER-Regulated Drug Products',
    organization: 'U.S. Food and Drug Administration',
    url: 'https://www.fda.gov/drugs/drug-safety-and-availability/medication-errors-related-cder-regulated-drug-products',
    reviewed: '2026-07-13',
  },
} satisfies Record<string, SourceLink>;

export const defaultScopeNote =
  'Use this lesson for study only. Follow your instructor, state nurse practice act, current clinical references, and facility policy for real patient care.';

