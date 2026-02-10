import { differenceInDays, addMonths, parseISO, format, isValid, differenceInMonths } from 'date-fns';
import { ScreeningInput, ClinicalResult, CKDStage, AlbuminuriaCategory } from '../types';

export const calculateCKDStage = (egfr: number): CKDStage => {
  if (egfr >= 90) return 'G1';
  if (egfr >= 60) return 'G2';
  if (egfr >= 45) return 'G3a';
  if (egfr >= 30) return 'G3b';
  if (egfr >= 15) return 'G4';
  return 'G5';
};

export const calculateAlbuminuriaCategory = (uacr: number): AlbuminuriaCategory => {
  if (uacr < 30) return 'A1';
  if (uacr < 300) return 'A2';
  return 'A3';
};

/**
 * Returns recommended monitoring frequency in months based on KDIGO Heatmap
 */
const getKDIGOFrequencyMonths = (stage: CKDStage, category: AlbuminuriaCategory): number => {
  // KDIGO 2012 Frequency recommendations
  // 12 months (Green/Yellow)
  // 6 months (Orange)
  // 3-4 months (Red)
  
  if (stage === 'G1' || stage === 'G2') {
    if (category === 'A1') return 12; // Low risk
    if (category === 'A2') return 12; // Mod risk
    return 6; // A3 High risk
  }
  
  if (stage === 'G3a') {
    if (category === 'A1') return 12; // Low risk
    if (category === 'A2') return 6; // High risk
    return 6; // A3 Very High risk (could be 4)
  }
  
  if (stage === 'G3b') {
    if (category === 'A1') return 6; // High risk
    if (category === 'A2') return 6; // Very High risk
    return 4; // A3 Very High risk
  }
  
  if (stage === 'G4') {
    if (category === 'A1') return 4; 
    if (category === 'A2') return 4;
    return 3;
  }
  
  if (stage === 'G5') {
    return 3; // Or check per dialysis protocol
  }
  
  return 12; // Default
};

export const analyzeScreening = (input: ScreeningInput): ClinicalResult => {
  const today = new Date();
  
  // 1. Check for immediate screening triggers (Diabetes/HTN + No Recent UACR + Age > 60)
  const isAtRisk = input.hasDiabetes || input.hasHypertension || input.age > 60;
  
  // Helper to list risks for message
  const riskFactorsList = [];
  if (input.hasDiabetes) riskFactorsList.push('Diabetes');
  if (input.hasHypertension) riskFactorsList.push('Hypertension');
  if (input.age > 60) riskFactorsList.push('Age > 60');
  const riskString = riskFactorsList.join(', ');

  // If UACR is unknown and they have risk factors
  if (input.uacrStatus === 'unknown' && isAtRisk) {
    return {
      actionType: 'ORDER_TEST',
      mainMessage: 'Order UACR & eGFR Now',
      subMessage: `Patient has risk factors (${riskString}) and no recent UACR on record.`,
      color: 'red'
    };
  }

  // If UACR is unknown but NO risk factors, and eGFR is okay
  if (input.uacrStatus === 'unknown' && !isAtRisk) {
    // If eGFR indicates CKD, we need UACR to stage it
    if (input.egfr && input.egfr < 60) {
      return {
        actionType: 'ORDER_TEST',
        mainMessage: 'Order UACR to Confirm Stage',
        subMessage: 'Reduced eGFR (<60) detected. UACR needed for full CKD staging.',
        color: 'yellow'
      };
    }
    
    return {
      actionType: 'MONITOR',
      mainMessage: 'Routine Screening',
      subMessage: 'No specific KDIGO trigger for UACR if no Diabetes, HTN, reduced eGFR, or Age > 60.',
      color: 'green'
    };
  }

  // 2. We have UACR history. Analyze Frequency.
  const stage = calculateCKDStage(input.egfr || 0); // Default to 0 if missing, though UI should prevent
  const category = calculateAlbuminuriaCategory(input.lastUacrValue || 0);
  
  const frequencyMonths = getKDIGOFrequencyMonths(stage, category);
  
  // Calculate Due Date
  let lastDate = new Date();
  if (input.lastUacrDate && isValid(parseISO(input.lastUacrDate))) {
    lastDate = parseISO(input.lastUacrDate);
  }
  
  const nextDueDate = addMonths(lastDate, frequencyMonths);
  const isOverdue = differenceInDays(today, nextDueDate) > 0;
  const daysUntil = differenceInDays(nextDueDate, today);

  // 3. Risk Factor Override Rule:
  // "if any of those risk factor and last UACR > 1 year ago they need a new one"
  const monthsSinceLast = differenceInMonths(today, lastDate);
  if (isAtRisk && monthsSinceLast >= 12 && frequencyMonths > 12) {
    // This catches cases where KDIGO might say longer but our clinic rule says annual for DM/HTN/Age>60
    return {
      ckdStage: stage,
      albuminuriaCategory: category,
      actionType: 'ORDER_TEST',
      mainMessage: 'Annual Screening Due',
      subMessage: `Last UACR was over 1 year ago. Risk factors (${riskString}) require annual check.`,
      color: 'red',
      monitoringFrequencyLabel: 'Annual'
    };
  }

  if (isOverdue) {
    return {
      ckdStage: stage,
      albuminuriaCategory: category,
      actionType: 'ORDER_TEST',
      mainMessage: `Check Overdue (${Math.abs(daysUntil)} days)`,
      subMessage: `Based on Stage ${stage} / ${category}, monitoring is recommended every ${frequencyMonths} months.`,
      color: 'red',
      monitoringFrequencyLabel: `Every ${frequencyMonths} months`
    };
  }

  return {
    ckdStage: stage,
    albuminuriaCategory: category,
    actionType: 'MONITOR',
    mainMessage: 'Current on Monitoring',
    subMessage: `Next check due: ${format(nextDueDate, 'MMM d, yyyy')}`,
    nextDueDate: format(nextDueDate, 'yyyy-MM-dd'),
    color: 'green',
    monitoringFrequencyLabel: `Every ${frequencyMonths} months`
  };
};