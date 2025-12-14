import React from 'react';
import { Trash2, Check, Sparkles } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div 
      onClick={() => onToggle(task.id)}
      className="group flex items-center justify-between p-4 mb-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/15 transition-all duration-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] animate-[fadeIn_0.5s_ease-out] cursor-pointer"
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Animated Checkbox Container */}
        <div className="relative flex items-center justify-center">
          <div
            className={`
              w-6 h-6 rounded-full border-2 transition-all duration-500 ease-out flex items-center justify-center
              ${task.completed
                ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 border-transparent scale-110 shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                : 'border-white/20 group-hover:border-indigo-400/50 group-hover:bg-indigo-500/10 scale-100'}
            `}
          >
             {/* Check Icon with rotation and scale animation */}
            <Check
              size={14}
              strokeWidth={3}
              className={`text-white transition-all duration-300 transform ${
                task.completed ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-45'
              }`}
            />
          </div>
        </div>
        
        <div className="flex flex-col">
           <span className={`text-base font-medium transition-all duration-500 ${
             task.completed ? 'text-white/30 line-through decoration-indigo-500/30' : 'text-white/90 group-hover:text-white'
           }`}>
            {task.title}
          </span>
          {task.isAiGenerated && (
            <span className="flex items-center gap-1 text-[10px] text-indigo-300/80 font-medium mt-0.5 transition-opacity duration-300">
              <Sparkles size={10} /> AI Suggestion
            </span>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="text-white/20 hover:text-red-400 p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-white/5"
        aria-label="Delete task"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};