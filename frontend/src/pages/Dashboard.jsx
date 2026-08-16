import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, deleteTask } from '../services/api';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import TaskModal from '../components/TaskModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, ListTodo, AlertTriangle, AlertCircle, RefreshCw, CheckSquare } from 'lucide-react';
import { isPast, isToday } from 'date-fns';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    ordering: '-created_at'
  });
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Clean up empty filters
      const params = { ...filters };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      // Set page_size high to get all for stats calculation
      params.page_size = 1000;
      
      const response = await getTasks(params);
      // Django DRF paginated response has results array
      setTasks(response.data.results || response.data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTask(deleteId);
      toast.success('Task deleted');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setDeleteId(null);
    }
  };

  // Calculate stats based on ALL tasks
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => t.due_date && isPast(new Date(t.due_date)) && !isToday(new Date(t.due_date)) && t.status !== 'Completed').length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-indigo-600">{user?.username}</span>!
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your tasks today.</p>
        </div>
        <button
          onClick={handleCreateTask}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="h-5 w-5" />
          New Task
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard title="Total Tasks" count={stats.total} icon={ListTodo} color="border-indigo-500" textColor="text-indigo-600" />
        <StatsCard title="Pending" count={stats.pending} icon={AlertCircle} color="border-yellow-500" textColor="text-yellow-600" />
        <StatsCard title="In Progress" count={stats.inProgress} icon={RefreshCw} color="border-blue-500" textColor="text-blue-600" />
        <StatsCard title="Completed" count={stats.completed} icon={CheckSquare} color="border-green-500" textColor="text-green-600" />
        <StatsCard title="Overdue" count={stats.overdue} icon={AlertTriangle} color="border-red-500" textColor="text-red-600" />
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Task Grid */}
      {loading ? (
        <div className="py-20"><LoadingSpinner message="Loading your tasks..." /></div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-800 font-medium mb-4">{error}</p>
          <button onClick={fetchTasks} className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium">
            Try Again
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
            <ListTodo className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            {filters.search || filters.status || filters.priority 
              ? "We couldn't find any tasks matching your current filters."
              : "You don't have any tasks yet. Create one to get started!"}
          </p>
          {(filters.search || filters.status || filters.priority) ? (
            <button
              onClick={() => setFilters({ status: '', priority: '', search: '', ordering: '-created_at' })}
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
              Clear filters
            </button>
          ) : (
            <button
              onClick={handleCreateTask}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 mx-auto"
            >
              <Plus className="h-4 w-4" /> Create your first task
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleEditTask}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Task</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        onSave={fetchTasks}
      />
    </div>
  );
};

export default Dashboard;
