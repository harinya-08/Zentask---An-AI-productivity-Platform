export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isAiGenerated?: boolean;
}

export interface TaskStats {
  total: number;
  completed: number;
  percentage: number;
}

export enum BackendMode {
  LOCAL = 'LOCAL',
  PYTHON = 'PYTHON'
}