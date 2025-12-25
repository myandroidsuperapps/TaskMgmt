
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  LayoutDashboard, 
  Calendar, 
  Table as TableIcon, 
  Bot, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Settings,
  MoreVertical,
  X,
  Sparkles,
  Download,
  Search,
  ChevronRight
} from 'lucide-react';
import { Task, TaskRecurrence, TaskStatus, TaskPriority } from './types';
import { storageService } from './services/storageService';
import { geminiService } from './services/geminiService';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import AISidebar from './components/AISidebar';
import SheetView from './components/SheetView';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'sheet'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedTasks = storageService.getTasks();
    setTasks(savedTasks);
  }, []);

  const saveTasks = useCallback((updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    storageService.saveTasks(updatedTasks);
  }, []);

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    saveTasks([task, ...tasks]);
    setIsFormOpen(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    saveTasks(updatedTasks);
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    saveTasks(updatedTasks);
  };

  const handleSetTaskStatus = (id: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === id) {
        // Handle recurrence logic when moving to DONE
        if (newStatus === TaskStatus.DONE && t.status !== TaskStatus.DONE && t.recurrence !== TaskRecurrence.NONE) {
          const nextDate = new Date(t.dueDate);
          if (t.recurrence === TaskRecurrence.MONTHLY) {
            nextDate.setMonth(nextDate.getMonth() + 1);
          } else if (t.recurrence === TaskRecurrence.YEARLY) {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
          }
          
          return {
            ...t,
            status: TaskStatus.TODO, // Reset to TODO for the next cycle
            dueDate: nextDate.toISOString().split('T')[0],
            lastCompletedDate: new Date().toISOString()
          };
        }
        
        return { ...t, status: newStatus };
      }
      return t;
    });
    saveTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar Nav */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">SheetTask AI</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('sheet')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'sheet' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <TableIcon size={18} />
            Sheet Export
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-200"
          >
            <Bot size={18} />
            AI Strategist
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setEditingTask(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100"
            >
              <Plus size={18} />
              New Task
            </button>
            <div className="w-px h-6 bg-slate-200" />
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Task Overview</h2>
                  <p className="text-slate-500 text-sm">Managing {tasks.length} tasks across various recurrences.</p>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                    {tasks.filter(t => t.recurrence !== TaskRecurrence.NONE).length} Recurring
                  </div>
                  <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                    {tasks.filter(t => t.status === TaskStatus.DONE).length} Completed
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onStatusChange={(status) => handleSetTaskStatus(task.id, status)}
                      onDelete={() => handleDeleteTask(task.id)}
                      onEdit={() => {
                        setEditingTask(task);
                        setIsFormOpen(true);
                      }}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <Plus size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">No tasks found</h3>
                      <p className="text-slate-500">Get started by creating your first task above.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sheet' && (
            <div className="max-w-6xl mx-auto">
              <SheetView tasks={tasks} />
            </div>
          )}
        </div>
      </main>

      {/* Panels & Modals */}
      {isAIPanelOpen && (
        <AISidebar tasks={tasks} onClose={() => setIsAIPanelOpen(false)} />
      )}

      {isFormOpen && (
        <TaskForm 
          task={editingTask || undefined} 
          onSubmit={editingTask ? handleUpdateTask : handleAddTask} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
