import React from 'react';
import { X, ArrowDown, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowDiagram: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Clinical Decision Workflow</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Flowchart Content */}
        <div className="p-6 md:p-10 flex flex-col items-center min-w-[320px]">
            
            {/* Start Node */}
            <div className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg mb-8 animate-in slide-in-from-top-4 fade-in duration-500">
                Start: Patient Check-In
            </div>
            
            <ArrowDown className="text-slate-300 mb-2" size={32} />

            {/* Step 1: Risk */}
            <div className="border-4 border-slate-200 dark:border-slate-700 p-6 rounded-xl bg-slate-50 dark:bg-slate-800 max-w-md w-full text-center relative z-0">
                <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-200">1. Who needs UACR?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Does patient have <span className="font-semibold text-slate-700 dark:text-slate-300">Diabetes</span>, <span className="font-semibold text-slate-700 dark:text-slate-300">Hypertension</span>, or <span className="font-semibold text-slate-700 dark:text-slate-300">Age &gt; 60</span>?
                </p>
            </div>

            <div className="flex w-full max-w-3xl justify-center gap-8 md:gap-16 mt-4 relative">
                
                {/* YES Branch */}
                <div className="flex flex-col items-center flex-1 max-w-xs relative">
                   {/* Connection Line */}
                   <div className="absolute -top-4 left-1/2 w-0.5 h-8 bg-slate-300 -translate-x-1/2"></div>
                   <div className="absolute -top-4 left-1/2 w-[calc(50%+2rem)] h-0.5 bg-slate-300 -translate-x-full md:-translate-x-[calc(50%+1rem)] origin-right"></div>
                   
                   <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold mb-4 z-10">YES</div>
                   
                   <div className="border-2 border-dashed border-blue-300 dark:border-blue-700 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center w-full shadow-sm h-full">
                       <p className="font-semibold text-sm mb-3 text-slate-800 dark:text-slate-200">Last UACR &gt; 1 year ago?</p>
                       <div className="flex flex-col gap-3">
                           <div className="bg-red-500 text-white p-2 rounded-lg text-xs font-bold shadow hover:bg-red-600 transition-colors">
                               YES: Order UACR + eGFR
                           </div>
                           <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 p-2 rounded-lg text-xs text-slate-600 dark:text-slate-300">
                               NO: Check Frequency Table
                           </div>
                       </div>
                   </div>
                </div>

                {/* NO Branch */}
                <div className="flex flex-col items-center flex-1 max-w-xs relative">
                    {/* Connection Line */}
                    <div className="absolute -top-4 left-1/2 w-0.5 h-8 bg-slate-300 -translate-x-1/2"></div>
                    <div className="absolute -top-4 right-1/2 w-[calc(50%+2rem)] h-0.5 bg-slate-300 translate-x-full md:translate-x-[calc(50%+1rem)] origin-left"></div>

                    <div className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm font-bold mb-4 z-10">NO</div>
                    
                    <div className="border-2 border-slate-200 dark:border-slate-700 p-4 rounded-xl bg-white dark:bg-slate-800 text-center w-full shadow-sm h-full">
                         <h3 className="font-bold text-sm mb-2 text-slate-800 dark:text-slate-200">2. Check eGFR</h3>
                         <p className="text-xs text-slate-500 mb-3">Is eGFR &lt; 60?</p>
                         
                         <div className="flex flex-col gap-3">
                             <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 p-2 rounded-lg text-xs font-bold">
                                YES: Order UACR (Confirm)
                             </div>
                             <div className="bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900 p-2 rounded-lg text-xs">
                                NO: Routine Care
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            <div className="my-10 w-full border-t border-slate-100 dark:border-slate-800 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-4 text-slate-400 text-xs uppercase font-bold tracking-widest">
                    Reference
                </div>
            </div>

            {/* Frequency Table Legend */}
            <div className="w-full max-w-4xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-center mb-6 flex items-center justify-center gap-2 text-slate-800 dark:text-white">
                    <Clock size={20} className="text-blue-500"/> KDIGO Monitoring Frequency
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="relative overflow-hidden bg-white dark:bg-slate-800 p-4 rounded-lg border-l-4 border-emerald-500 shadow-sm">
                        <div className="text-3xl font-black text-slate-800 dark:text-white mb-1">12 <span className="text-sm font-normal text-slate-500">months</span></div>
                        <div className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Low Risk</div>
                        <div className="text-[10px] text-slate-400 mt-1">Green / Yellow Heatmap</div>
                    </div>
                    <div className="relative overflow-hidden bg-white dark:bg-slate-800 p-4 rounded-lg border-l-4 border-amber-500 shadow-sm">
                        <div className="text-3xl font-black text-slate-800 dark:text-white mb-1">6 <span className="text-sm font-normal text-slate-500">months</span></div>
                        <div className="text-xs font-bold text-amber-600 uppercase tracking-wide">Moderate Risk</div>
                        <div className="text-[10px] text-slate-400 mt-1">Orange Heatmap</div>
                    </div>
                    <div className="relative overflow-hidden bg-white dark:bg-slate-800 p-4 rounded-lg border-l-4 border-red-500 shadow-sm">
                        <div className="text-3xl font-black text-slate-800 dark:text-white mb-1">3-4 <span className="text-sm font-normal text-slate-500">months</span></div>
                        <div className="text-xs font-bold text-red-600 uppercase tracking-wide">High Risk</div>
                        <div className="text-[10px] text-slate-400 mt-1">Red Heatmap</div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};