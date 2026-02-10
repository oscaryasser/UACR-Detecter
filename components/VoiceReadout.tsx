import React, { useState, useEffect } from 'react';
import { Volume2, StopCircle } from 'lucide-react';
import { ClinicalResult } from '../types';

interface Props {
  patientName?: string;
  data: ClinicalResult;
}

export const VoiceReadout: React.FC<Props> = ({ patientName = 'Patient', data }) => {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSupported(true);
    }
  }, []);

  const handleSpeak = () => {
    if (!supported) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();

    const stageInfo = data.ckdStage ? `Calculated CKD Stage is ${data.ckdStage}.` : '';
    const albInfo = data.albuminuriaCategory ? `Albuminuria Category is ${data.albuminuriaCategory}.` : '';

    const text = `
      Summary for ${patientName}. 
      ${data.mainMessage}. 
      ${data.subMessage}. 
      ${stageInfo} 
      ${albInfo} 
      Recommendation: ${data.monitoringFrequencyLabel || 'Follow clinical guidelines.'}
    `;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  if (!supported) return null;

  return (
    <button
      onClick={speaking ? handleStop : handleSpeak}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        speaking 
          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300' 
          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
      }`}
      title="Read summary aloud"
      type="button"
    >
      {speaking ? <StopCircle size={16} /> : <Volume2 size={16} />}
      {speaking ? 'Stop' : 'Read Aloud'}
    </button>
  );
};