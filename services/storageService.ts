
import { Task } from '../types';

const STORAGE_KEY = 'sheettask_ai_data';

export const storageService = {
  getTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
