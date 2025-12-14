import React, { useState } from 'react';
import { Sparkles, ArrowRight, X, Loader2 } from 'lucide-react';

interface AiAssistantProps {
  onSuggest: (goal: string) => Promise<void>;
  isLoading: boolean;
  onClose: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ onSuggest, isLoading, onClose }) => {
  const [goal, setGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) onSuggest(goal);
  };

  return (
    <div className="mb-6 p-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-[#0f172a] rounded-xl p-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-white/20 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
        
        <div className="flex items-center gap-2 mb-3 text-indigo-300">
          <Sparkles size={18} />
          <span className="font-semibold text-sm tracking-wide">AI BRAINSTORM</span>
        </div>
        
        <p className="text-white/60 text-xs mb-4">
          What is your main goal? I will generate a plan for you.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Plan a surprise party..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-colors"
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !goal.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};