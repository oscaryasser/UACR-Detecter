import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { 
  Activity, 
  Menu, 
  RotateCcw, 
  CheckCircle,
  AlertTriangle,
  Moon,
  Sun,
  ClipboardList,
  ChevronRight,
  GitGraph,
  TestTube2,
  CalendarCheck
} from 'lucide-react';
import { ReferencePanel } from './components/ReferencePanel';
import { WorkflowDiagram } from './components/WorkflowDiagram';
import { analyzeScreening } from './services/clinicalLogic';
import { ScreeningInput, ClinicalResult } from './types';

// --- Local Storage Hooks ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

const App: React.FC = () => {
  // State
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  
  // Screening State
  const initialInput: ScreeningInput = {
    age: 0,
    hasDiabetes: false,
    hasHypertension: false,
    egfr: 0,
    uacrStatus: 'unknown',
    lastUacrDate: '',
    lastUacrValue: 0
  };
  
  const [input, setInput] = useState<ScreeningInput>(initialInput);
  const [result, setResult] = useState<ClinicalResult | null>(null);

  // Effects
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Real-time Analysis
  useEffect(() => {
    // Only analyze if minimum fields are met to avoid noise
    // Minimal valid input: age > 0 and egfr > 0
    if (input.egfr > 0) {
      const res = analyzeScreening(input);
      setResult(res);
    } else {
        setResult(null);
    }
  }, [input]);

  // Handlers
  const handleReset = () => {
    setInput(initialInput);
    setResult(null);
  };

  const handleInputChange = (field: keyof ScreeningInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/30 hidden sm:block">
                <Activity className="text-white" size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">NephroTrack <span className="text-blue-500">QuickCheck</span></h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">MA Screening Tool</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
             {/* Workflow Button */}
            <button 
                onClick={() => setIsWorkflowOpen(true)}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
                <GitGraph size={18} />
                <span className="hidden sm:inline">Clinical Flow</span>
                <span className="sm:hidden">Flow</span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 lg:hidden rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-6">
          
          {/* LEFT: Input Column */}
          <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <ClipboardList className="text-blue-500"/> Screening Inputs
                    </h2>
                    <button 
                        onClick={handleReset}
                        className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full transition-colors"
                    >
                        <RotateCcw size={14}/> Reset
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Section 1: Demographics & Risk */}
                    <div>
                        <label className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-3 block flex items-center gap-2">
                           1. Who needs UACR? <span className="text-slate-400 font-normal normal-case text-xs">(Screening Triggers)</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${input.hasDiabetes ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-200'}`}>
                                    <input 
                                        type="checkbox" 
                                        checked={input.hasDiabetes} 
                                        onChange={(e) => handleInputChange('hasDiabetes', e.target.checked)}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" 
                                    />
                                    <span className="ml-3 font-semibold text-slate-700 dark:text-slate-200">Diabetes</span>
                                </label>
                                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${input.hasHypertension ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-200'}`}>
                                    <input 
                                        type="checkbox" 
                                        checked={input.hasHypertension} 
                                        onChange={(e) => handleInputChange('hasHypertension', e.target.checked)}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" 
                                    />
                                    <span className="ml-3 font-semibold text-slate-700 dark:text-slate-200">Hypertension</span>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Patient Age</label>
                                <div className={`relative p-1 rounded-xl border-2 transition-all ${input.age > 60 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                                    <input 
                                        type="number" 
                                        value={input.age || ''}
                                        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                                        placeholder="Age"
                                        className="w-full text-lg p-3 rounded-lg bg-transparent focus:outline-none"
                                    />
                                    {input.age > 60 && (
                                        <span className="absolute top-1 right-2 text-[10px] font-bold text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Trigger
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Age &gt; 60 triggers screening</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: eGFR */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">2. Current eGFR</label>
                        <div>
                            <input 
                                type="number" 
                                value={input.egfr || ''}
                                onChange={(e) => handleInputChange('egfr', parseFloat(e.target.value))}
                                placeholder="Enter eGFR value"
                                className="w-full text-2xl font-bold p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-center"
                            />
                             <p className="text-xs text-slate-500 mt-2 text-center">mL/min/1.73m²</p>
                        </div>
                    </div>

                    {/* Section 3: UACR History */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">3. UACR History</label>
                        <div className="space-y-4">
                            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <button 
                                    onClick={() => handleInputChange('uacrStatus', 'unknown')}
                                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${input.uacrStatus === 'unknown' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'}`}
                                >
                                    Unknown / Never Checked
                                </button>
                                <button 
                                    onClick={() => handleInputChange('uacrStatus', 'known')}
                                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${input.uacrStatus === 'known' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'}`}
                                >
                                    Has Recent Value
                                </button>
                            </div>

                            {input.uacrStatus === 'known' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date Checked</label>
                                        <input 
                                            type="date"
                                            value={input.lastUacrDate}
                                            onChange={(e) => handleInputChange('lastUacrDate', e.target.value)}
                                            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Value (mg/g)</label>
                                        <input 
                                            type="number"
                                            value={input.lastUacrValue || ''}
                                            onChange={(e) => handleInputChange('lastUacrValue', parseFloat(e.target.value))}
                                            placeholder="0"
                                            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* RIGHT: Result Column (Visual Flow) */}
          <div className="flex-1 max-w-lg mx-auto w-full">
            {result ? (
                <div className={`sticky top-6 rounded-3xl overflow-hidden shadow-xl border-4 animate-in zoom-in-95 duration-300 flex flex-col justify-between min-h-[400px] text-center bg-white dark:bg-slate-800 ${
                    result.color === 'red' ? 'border-red-500' :
                    result.color === 'yellow' ? 'border-amber-400' :
                    'border-emerald-500'
                }`}>
                    
                    {/* Action Banner */}
                    <div className={`p-6 pb-8 ${
                        result.color === 'red' ? 'bg-red-500 text-white' :
                        result.color === 'yellow' ? 'bg-amber-400 text-amber-950' :
                        'bg-emerald-500 text-white'
                    }`}>
                        <div className="uppercase font-bold tracking-widest text-sm mb-2 opacity-90">Clinical Action</div>
                        <div className="flex items-center justify-center gap-3">
                             {result.actionType === 'ORDER_TEST' ? <TestTube2 size={32}/> : <CalendarCheck size={32}/>}
                             <h2 className="text-4xl font-black leading-none uppercase">
                                {result.actionType === 'ORDER_TEST' ? 'ORDER UACR' : 'MONITOR'}
                             </h2>
                        </div>
                    </div>

                    <div className="p-8 flex flex-col items-center justify-center flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {result.mainMessage}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-xs mx-auto">
                            {result.subMessage}
                        </p>

                        {(result.ckdStage || result.albuminuriaCategory) && (
                            <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-100 dark:bg-black/20 p-4 rounded-xl w-full">
                                <div>
                                    <p className="text-xs uppercase tracking-wider opacity-60 font-bold mb-1">CKD Stage</p>
                                    <p className="text-2xl font-bold">{result.ckdStage || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider opacity-60 font-bold mb-1">Albuminuria</p>
                                    <p className="text-2xl font-bold">{result.albuminuriaCategory || '-'}</p>
                                </div>
                            </div>
                        )}

                        {result.monitoringFrequencyLabel && (
                            <div className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-3 px-6 rounded-full font-bold mx-auto shadow-lg">
                            <span>Schedule: {result.monitoringFrequencyLabel}</span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl bg-slate-50 dark:bg-slate-800/50">
                    <ChevronRight size={64} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium text-center">Complete the screening inputs to generate a clinical recommendation.</p>
                </div>
            )}
          </div>

        </main>
      </div>

      <WorkflowDiagram isOpen={isWorkflowOpen} onClose={() => setIsWorkflowOpen(false)} />
      <ReferencePanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

export default App;