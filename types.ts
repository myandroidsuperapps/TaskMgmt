
export enum TaskRecurrence {
  NONE = 'one-time',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  recurrence: TaskRecurrence;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  lastCompletedDate?: string;
  createdAt: string;
}

export interface AppState {
  tasks: Task[];
  isAIPanelOpen: boolean;
  selectedTask: Task | null;
  isSheetSynced: boolean;
}
