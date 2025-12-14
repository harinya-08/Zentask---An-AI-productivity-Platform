import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface QuickAiActionsProps {
  onAction: (prompt: string) => void;
  disabled: boolean;
}

const ACTIONS = [
  "Plan my day",
  "Project roadmap",
  "Weekly groceries",
  "Study schedule",
  "Gym workout",
  "Clean apartment"
];

export const QuickAiActions: React.FC<QuickAiActionsProps> = ({ onAction, disabled }) => {
  return (
    <div className="mt-12 border-t border-white/5 pt-8 pb-4 animate-[fadeIn_0.8s_ease-out]">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="p-1.5 bg-indigo-500/10 rounded-lg">
          <Zap size={14} className="text-indigo-400" />
        </div>
        <span className="text-xs font-bold text-indigo-200/50 uppercase tracking-widest">
          Quick AI Suggestions
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ACTIONS.map((action, index) => (
          <button
            key={action}
            onClick={() => onAction(action)}
            disabled={disabled}
            className="group relative overflow-hidden px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:via-indigo-500/5 transition-all duration-500" />
            <span className="relative z-10 text-xs font-medium text-indigo-100/70 group-hover:text-white transition-colors flex items-center gap-2">
              {action}
              <Sparkles size={10} className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity -ml-1" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};