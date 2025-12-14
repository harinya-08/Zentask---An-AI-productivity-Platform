import React from 'react';
import { TaskStats } from '../types';

interface ProgressBarProps {
  stats: TaskStats;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ stats }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-xs font-bold text-indigo-200/70 uppercase tracking-widest">Efficiency</h2>
        <span className="text-sm font-bold text-indigo-300">{Math.round(stats.percentage)}%</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(167,139,250,0.5)]"
          style={{ width: `${stats.percentage}%` }}
        ></div>
      </div>
      <p className="text-[10px] text-white/40 mt-2 text-right">
        {stats.completed}/{stats.total} completed
      </p>
    </div>
  );
};