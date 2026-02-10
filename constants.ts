import { AlbuminuriaCategory, CKDStage } from "./types";

export const CKD_STAGES: { id: CKDStage; range: string; desc: string }[] = [
  { id: 'G1', range: '≥ 90', desc: 'Normal or High' },
  { id: 'G2', range: '60 - 89', desc: 'Mildly Decreased' },
  { id: 'G3a', range: '45 - 59', desc: 'Mildly to Moderately Decreased' },
  { id: 'G3b', range: '30 - 44', desc: 'Moderately to Severely Decreased' },
  { id: 'G4', range: '15 - 29', desc: 'Severely Decreased' },
  { id: 'G5', range: '< 15', desc: 'Kidney Failure' },
];

export const ALBUMINURIA_CATEGORIES: { id: AlbuminuriaCategory; range: string; desc: string }[] = [
  { id: 'A1', range: '< 30 mg/g', desc: 'Normal to mildly increased' },
  { id: 'A2', range: '30 - 299 mg/g', desc: 'Moderately increased' },
  { id: 'A3', range: '≥ 300 mg/g', desc: 'Severely increased' },
];