
import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { geminiService } from '../services/geminiService';
import { Bot, Sparkles, X, ChevronRight, Loader2, BrainCircuit } from 'lucide-react';

interface AISidebarProps {
  tasks: Task[];
  onClose: () => void;
}

const AISidebar: React.FC<AISidebarProps> = ({ tasks, onClose }) => {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const getAIInsights = async () => {
    setIsLoading(true);
    const result = await geminiService.analyzeTasks(tasks);
    setInsights(result);
    setIsLoading(false);
  };

  useEffect(() => {
    getAIInsights();
  }, [tasks.length]);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">AI Strategist</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Powered by Gemini</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
          <Sparkles className="absolute -right-2 -top-2 opacity-20" size={80} />
          <h3 className="font-bold mb-1 flex items-center gap-2 relative z-10">
            Smart Analysis
          </h3>
          <p className="text-indigo-100 text-xs relative z-10">
            Analyzing {tasks.length} tasks to optimize your workflow and prevent burnout.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Actionable Insights</h4>
            <button 
              onClick={getAIInsights}
              disabled={isLoading}
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={12} /> : <BrainCircuit size={12} />}
              Refresh
            </button>
          </div>

          <div className="prose prose-slate prose-sm max-w-none">
            {isLoading ? (
              <div className="space-y-4 py-8">
                <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
                <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" />
              </div>
            ) : insights ? (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 whitespace-pre-wrap text-slate-600 leading-relaxed italic">
                {insights}
              </div>
            ) : (
              <p className="text-slate-400 italic text-center py-10">
                Add more tasks to get AI-powered strategic advice.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recommended Actions</h4>
          <div className="space-y-2">
            {[
              "Review high-priority tasks",
              "Schedule monthly check-ins",
              "Sync to Google Sheets"
            ].map((action, i) => (
              <button key={i} className="w-full p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between group hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left">
                <span className="text-sm font-medium text-slate-700">{action}</span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-medium">
          Always review AI suggestions before applying significant schedule changes.
        </p>
      </div>
    </div>
  );
};

export default AISidebar;
