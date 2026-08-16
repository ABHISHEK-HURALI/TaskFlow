import React from 'react';
import { Calendar, Edit2, Trash2, Clock } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  'Completed': 'bg-green-100 text-green-800 border-green-200'
};

const priorityColors = {
  'Low': 'bg-green-100 text-green-800 border-green-200',
  'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'High': 'bg-red-100 text-red-800 border-red-200'
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== 'Completed';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow group relative">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-gray-900 text-lg line-clamp-1 pr-12" title={task.title}>
          {task.title}
        </h3>
        <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors" title="Edit Task">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors" title="Delete Task">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
        {task.description || <span className="italic text-gray-400">No description</span>}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[task.status] || 'bg-gray-100 text-gray-800'}`}>
          {task.status}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityColors[task.priority] || 'bg-gray-100 text-gray-800'}`}>
          {task.priority}
        </span>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50 text-xs">
        <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No due date'}
            {isOverdue && ' (Overdue)'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400" title={`Created: ${task.created_at ? format(new Date(task.created_at), 'MMM d, yyyy') : 'Unknown'}`}>
          <Clock className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
