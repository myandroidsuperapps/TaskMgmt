
import React from 'react';
import { Task } from '../types';
import { Download, Share2, Copy, FileText, Bot } from 'lucide-react';

interface SheetViewProps {
  tasks: Task[];
}

const SheetView: React.FC<SheetViewProps> = ({ tasks }) => {
  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Description', 'Due Date', 'Recurrence', 'Priority', 'Status', 'Category', 'Created At'];
    const rows = tasks.map(t => [
      t.id,
      t.title,
      t.description,
      t.dueDate,
      t.recurrence,
      t.priority,
      t.status,
      t.category,
      t.createdAt
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sheettask_ai_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sheet Sync View</h2>
          <p className="text-slate-500 text-sm">Review your data in spreadsheet format before syncing to Google Sheets.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
            <Share2 size={18} />
            Connect Google Sheet
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Title</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Due Date</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Recurrence</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Priority</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Category</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">{task.title}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{task.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${task.recurrence === 'one-time' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-50 text-indigo-700'}`}>
                      {task.recurrence}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600 capitalize">{task.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">{task.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${task.status === 'done' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-xs font-medium text-slate-600 capitalize">{task.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    No data available to display in sheet view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <FileText size={20} />
          </div>
          <h3 className="font-bold text-slate-800">Ready for Sheets</h3>
          <p className="text-xs text-slate-500">Your task data is structured as flat objects, making it compatible with Google Sheets range updates.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <Copy size={20} />
          </div>
          <h3 className="font-bold text-slate-800">Copy Formula</h3>
          <p className="text-xs text-slate-500">Easily copy headers and data to your clipboard for a quick manual paste into any spreadsheet.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
            <Bot size={20} />
          </div>
          <h3 className="font-bold text-slate-800">Data Validation</h3>
          <p className="text-xs text-slate-500">Gemini ensures your categories and dates follow consistent formats for error-free data entry.</p>
        </div>
      </div>
    </div>
  );
};

export default SheetView;
