export type AlbuminuriaCategory = 'A1' | 'A2' | 'A3';
export type CKDStage = 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';

export interface ScreeningInput {
  age: number;
  hasDiabetes: boolean;
  hasHypertension: boolean;
  
  // Clinical Metrics
  egfr: number; // Current eGFR
  
  // UACR History
  uacrStatus: 'unknown' | 'known';
  lastUacrValue?: number;
  lastUacrDate?: string; // YYYY-MM-DD
}

export interface ClinicalResult {
  ckdStage?: CKDStage;
  albuminuriaCategory?: AlbuminuriaCategory;
  
  // Decision
  actionType: 'ORDER_TEST' | 'MONITOR' | 'URGENT';
  mainMessage: string;
  subMessage: string;
  nextDueDate?: string;
  
  monitoringFrequencyLabel?: string; // e.g. "Every 6 months"
  color: 'green' | 'yellow' | 'red';
}