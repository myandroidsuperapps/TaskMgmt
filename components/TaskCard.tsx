
import React, { useState } from 'react';
import { Task, TaskRecurrence, TaskStatus, TaskPriority } from '../types';
import { Calendar, Repeat, CheckCircle2, Circle, Edit2, Trash2, Clock, ChevronDown } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (status: TaskStatus) => void;
  onDelete: () => void;
  onEdit: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onDelete, onEdit }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const priorityColors = {
    [TaskPriority.LOW]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [TaskPriority.MEDIUM]: 'bg-amber-100 text-amber-700 border-amber-200',
    [TaskPriority.HIGH]: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const statusConfig = {
    [TaskStatus.TODO]: {
      icon: <Circle size={22} />,
      color: 'text-slate-400 hover:text-slate-600',
      bg: 'bg-slate-50',
      label: 'Todo'
    },
    [TaskStatus.IN_PROGRESS]: {
      icon: <Clock size={22} className="animate-pulse" />,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      label: 'In Progress'
    },
    [TaskStatus.DONE]: {
      icon: <CheckCircle2 size={22} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      label: 'Done'
    }
  };

  const currentStatus = statusConfig[task.status];
  const isDone = task.status === TaskStatus.DONE;

  const cycleStatus = () => {
    const statuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
    const currentIndex = statuses.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    onStatusChange(statuses[nextIndex]);
  };

  return (
    <div className={`group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all relative ${isDone ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="relative">
          <button 
            onClick={cycleStatus}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowStatusMenu(!showStatusMenu);
            }}
            className={`transition-colors p-1 -ml-1 rounded-lg hover:bg-slate-100 ${currentStatus.color}`}
            title="Click to cycle status, Right-click for options"
          >
            {currentStatus.icon}
          </button>
          
          {showStatusMenu && (
            <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {Object.entries(statusConfig).map(([status, config]) => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(status as TaskStatus);
                    setShowStatusMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors ${task.status === status ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-600'}`}
                >
                  <span className={task.status === status ? 'text-indigo-600' : 'text-slate-400'}>
                    {React.cloneElement(config.icon as React.ReactElement, { size: 16, className: '' })}
                  </span>
                  {config.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <h3 className={`font-semibold text-slate-800 leading-tight flex-1 ${isDone ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h3>
          {task.status === TaskStatus.IN_PROGRESS && (
            <span className="flex-shrink-0 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-tighter rounded border border-indigo-200">
              Active
            </span>
          )}
        </div>
        
        {task.description && (
          <p className={`text-sm line-clamp-2 ${isDone ? 'text-slate-400' : 'text-slate-500'}`}>
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          {task.recurrence !== TaskRecurrence.NONE && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Repeat size={10} />
              {task.recurrence}
            </span>
          )}
          <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {task.category}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Calendar size={14} />
            <span>Due {task.dueDate}</span>
          </div>
          {isDone && task.lastCompletedDate && (
            <div className="text-[10px] text-emerald-600 font-medium italic">
              Done {new Date(task.lastCompletedDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
