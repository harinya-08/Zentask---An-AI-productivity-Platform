import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Server, Monitor, Sparkles, Loader2, AlertCircle, Zap } from 'lucide-react';
import { Task, BackendMode, TaskStats } from './types';
import { taskService } from './services/taskService';
import { generateSubtasks, generateSuggestions } from './services/geminiService';
import { TaskItem } from './components/TaskItem';
import { ProgressBar } from './components/ProgressBar';
import { AiAssistant } from './components/AiAssistant';
import { QuickAiActions } from './components/QuickAiActions';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState<BackendMode>(BackendMode.LOCAL);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskService.fetchTasks(mode);
      setTasks(data);
    } catch (err) {
      if (mode === BackendMode.PYTHON) {
        setError("Backend disconnected. Is server running?");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const tempValue = inputValue;
    setInputValue('');
    
    try {
      const newTask = await taskService.addTask(mode, tempValue);
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      setInputValue(tempValue);
      setError("Failed to add task.");
    }
  };

  const handleMagicSplit = async () => {
    if (!inputValue.trim()) return;
    
    setIsAiProcessing(true);
    try {
      const mainTask = await taskService.addTask(mode, inputValue);
      setInputValue(''); 
      const subtaskTitles = await generateSubtasks(mainTask.title);
      const newTasks = await taskService.addTasksBulk(mode, subtaskTitles);
      
      setTasks(prev => [...prev, mainTask, ...newTasks]);
    } catch (err) {
      setError("Magic Split failed.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleAiBrainstorm = async (goal: string) => {
    setIsAiProcessing(true);
    try {
      const titles = await generateSuggestions(goal);
      if (titles.length === 0) throw new Error("No suggestions");
      
      const newTasks = await taskService.addTasksBulk(mode, titles);
      setTasks(prev => [...prev, ...newTasks]);
      setShowAssistant(false);
    } catch (err) {
      setError("Brainstorm failed. Check API Key.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleToggle = async (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    try {
      await taskService.toggleTask(mode, id);
    } catch (err) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }
  };

  const handleDelete = async (id: string) => {
    const backup = tasks;
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await taskService.deleteTask(mode, id);
    } catch (err) {
      setTasks(backup);
    }
  };

  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    return {
      total,
      completed,
      percentage: total === 0 ? 0 : (completed / total) * 100
    };
  }, [tasks]);

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-md relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8 animate-[fadeIn_0.5s_ease-out]">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-indigo-200 tracking-tight">
              ZenTask
            </h1>
            <p className="text-indigo-200/50 text-sm mt-1 font-light tracking-wide">
              AI-Enhanced Productivity
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex bg-white/5 backdrop-blur-md rounded-lg p-1 shadow-lg border border-white/10">
              <button
                onClick={() => setMode(BackendMode.LOCAL)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                  mode === BackendMode.LOCAL ? 'bg-indigo-500 text-white shadow-md' : 'text-white/50 hover:text-white'
                }`}
              >
                <Monitor size={14} /> Local
              </button>
              <button
                onClick={() => setMode(BackendMode.PYTHON)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                  mode === BackendMode.PYTHON ? 'bg-indigo-500 text-white shadow-md' : 'text-white/50 hover:text-white'
                }`}
              >
                <Server size={14} /> Python
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <ProgressBar stats={stats} />

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm animate-[slideDown_0.3s_ease-out]">
            <AlertCircle size={16} />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="hover:text-white">×</button>
          </div>
        )}

        {/* AI Assistant Toggle */}
        {!showAssistant && (
           <button 
             onClick={() => setShowAssistant(true)}
             className="w-full mb-6 py-3 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-indigo-300 hover:border-indigo-400/50 hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center gap-2 group"
           >
             <Zap size={16} className="group-hover:text-yellow-300 transition-colors" />
             Need inspiration? Launch Brainstorm Mode
           </button>
        )}

        {/* AI Assistant Module */}
        {showAssistant && (
          <AiAssistant 
            onSuggest={handleAiBrainstorm} 
            isLoading={isAiProcessing} 
            onClose={() => setShowAssistant(false)} 
          />
        )}

        {/* Main Input */}
        <div className="bg-white/5 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-white/10 mb-8 relative z-20">
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 bg-transparent outline-none text-white placeholder:text-white/20"
            />
            
            {inputValue.trim() && (
               <button
                type="button"
                onClick={handleMagicSplit}
                disabled={isAiProcessing}
                className="p-3 text-purple-300 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
                title="Magic Split: Break this down with AI"
              >
                 {isAiProcessing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              </button>
            )}

            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-indigo-900/50 hover:shadow-indigo-600/50 active:scale-95"
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="space-y-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/20 gap-3">
              <Loader2 className="animate-spin" size={30} />
              <p className="text-xs tracking-widest uppercase">Syncing</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 text-white/20 border-2 border-dashed border-white/5 rounded-2xl">
              <p className="mb-2">Your canvas is empty.</p>
              <p className="text-sm">Start by adding a task or using AI.</p>
            </div>
          ) : (
            tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
        
        {/* Bottom AI Suggestions */}
        <QuickAiActions onAction={handleAiBrainstorm} disabled={isAiProcessing} />

      </div>
    </div>
  );
};

export default App;