import { Task, BackendMode } from '../types';
import { API_URL, MOCK_TASKS } from '../constants';

const STORAGE_KEY = 'zentask_local_data';

const getLocalTasks = (): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : MOCK_TASKS;
};

const saveLocalTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const taskService = {
  
  async fetchTasks(mode: BackendMode): Promise<Task[]> {
    if (mode === BackendMode.PYTHON) {
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch from backend');
      return res.json();
    } else {
      await new Promise(r => setTimeout(r, 300));
      return getLocalTasks();
    }
  },

  async addTask(mode: BackendMode, title: string, isAiGenerated: boolean = false): Promise<Task> {
    if (mode === BackendMode.PYTHON) {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, isAiGenerated })
      });
      if (!res.ok) throw new Error('Failed to add task');
      return res.json();
    } else {
      const tasks = getLocalTasks();
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        isAiGenerated
      };
      saveLocalTasks([...tasks, newTask]);
      return newTask;
    }
  },

  async addTasksBulk(mode: BackendMode, titles: string[], isAiGenerated: boolean = true): Promise<Task[]> {
    if (mode === BackendMode.PYTHON) {
       const res = await fetch(`${API_URL}/tasks/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(titles.map(title => ({ title, isAiGenerated })))
      });
      if (!res.ok) throw new Error('Failed to add bulk tasks');
      return res.json();
    } else {
      const tasks = getLocalTasks();
      const newTasks: Task[] = titles.map(title => ({
        id: crypto.randomUUID(),
        title,
        completed: false,
        isAiGenerated
      }));
      saveLocalTasks([...tasks, ...newTasks]);
      return newTasks;
    }
  },

  async toggleTask(mode: BackendMode, id: string): Promise<void> {
    if (mode === BackendMode.PYTHON) {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'PUT' });
      if (!res.ok) throw new Error('Failed to toggle task');
    } else {
      const tasks = getLocalTasks();
      const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      saveLocalTasks(updated);
    }
  },

  async deleteTask(mode: BackendMode, id: string): Promise<void> {
    if (mode === BackendMode.PYTHON) {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
    } else {
      const tasks = getLocalTasks();
      const updated = tasks.filter(t => t.id !== id);
      saveLocalTasks(updated);
    }
  }
};