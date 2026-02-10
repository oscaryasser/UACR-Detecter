import React from 'react';
import { CKD_STAGES, ALBUMINURIA_CATEGORIES } from '../constants';
import { X, Info, ArrowRight, AlertCircle, Calendar } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferencePanel: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <aside 
      className={`fixed inset-y-0 right-0 w-80 bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto border-l border-slate-200 dark:border-slate-700 ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:w-96 lg:flex-shrink-0 print:hidden`}
    >
      <div className="p-5">
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Info size={20} /> Guidelines
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        {/* Logic Flow */}
        <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">MA Quick Workflow</h3>
            <div className="space-y-4">
                <div className="flex gap-3">
                    <div className="mt-1 min-w-[24px] h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Who needs UACR?</p>
                        <p className="text-xs text-slate-500">Diabetes, Hypertension, or Age &gt; 60?</p>
                    </div>
                </div>
                <div className="ml-3 pl-3 border-l-2 border-slate-100 dark:border-slate-700 space-y-4 py-2">
                     <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-xs border border-red-100 dark:border-red-900/50">
                        <p className="font-bold text-red-800 dark:text-red-200 mb-1 flex items-center gap-1"><AlertCircle size={12}/> Needs UACR if:</p>
                        <ul className="list-disc list-inside text-red-700 dark:text-red-300">
                            <li>Last check &gt; 1 year ago</li>
                            <li>Never checked</li>
                        </ul>
                     </div>
                </div>
                
                <div className="flex gap-3">
                    <div className="mt-1 min-w-[24px] h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">KDIGO Staging</p>
                        <p className="text-xs text-slate-500">If current UACR &lt; 1 yr old, check frequency:</p>
                    </div>
                </div>
                 <div className="ml-3 pl-3 border-l-2 border-slate-100 dark:border-slate-700 py-2">
                     <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded text-xs border border-emerald-100 dark:border-emerald-900/50">
                        <p className="font-bold text-emerald-800 dark:text-emerald-200 mb-1 flex items-center gap-1"><Calendar size={12}/> Monitoring</p>
                        <ul className="list-disc list-inside text-emerald-700 dark:text-emerald-300">
                            <li>Low Risk: Annual</li>
                            <li>Mod Risk: Every 6mo</li>
                            <li>High Risk: Every 3-4mo</li>
                        </ul>
                     </div>
                </div>
            </div>
        </div>

        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Albuminuria (A) Categories</h3>
        <div className="space-y-2 mb-6">
          {ALBUMINURIA_CATEGORIES.map((cat) => (
            <div key={cat.id} className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{cat.id}</span>
                <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded">{cat.range}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">{cat.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">eGFR (G) Stages</h3>
        <div className="grid grid-cols-1 gap-1 mb-6">
          {CKD_STAGES.map((stage) => (
            <div key={stage.id} className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex flex-col">
                <span className="font-bold text-xs">{stage.id}</span>
                <span className="text-[10px] text-slate-500 leading-none">{stage.desc}</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-1.5 py-0.5 rounded">
                {stage.range}
              </span>
            </div>
          ))}
        </div>

      </div>
    </aside>
  );
};