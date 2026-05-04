import { useState, useEffect } from 'react';
import { ListTodo, Loader2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import taskAPI from '../../api/task.api';
import TaskList from '../../components/task/TaskList';
import { toast } from 'react-hot-toast';

/**
 * My Tasks page — shows all tasks assigned to current user
 */
const Tasks = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getMyTasks();
      setTasks(response.data);
    } catch (err) {
      toast.error('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTask(taskId, { status: newStatus });
      toast.success('Task status updated');
      setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
    } catch (err) {
      toast.error(err.message || 'Failed to update task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'overdue') {
      return task.dueDate && new Date() > new Date(task.dueDate) && task.status !== 'done';
    }
    return task.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ListTodo size={28} style={{ color: 'var(--color-primary)' }} />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              My Tasks
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            All tasks assigned to you across projects
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3">
          <div
            className="text-center px-4 py-2 rounded-lg"
            style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)' }}
          >
            <p className="text-lg font-bold" style={{ color: '#818cf8' }}>{tasks.length}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total</p>
          </div>
          <div
            className="text-center px-4 py-2 rounded-lg"
            style={{ background: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.3)' }}
          >
            <p className="text-lg font-bold" style={{ color: '#34d399' }}>
              {tasks.filter((t) => t.status === 'done').length}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Done</p>
          </div>
          <div
            className="text-center px-4 py-2 rounded-lg"
            style={{ background: 'rgba(248, 113, 113, 0.12)', border: '1px solid rgba(248, 113, 113, 0.3)' }}
          >
            <p className="text-lg font-bold" style={{ color: '#f87171' }}>
              {tasks.filter((t) => t.dueDate && new Date() > new Date(t.dueDate) && t.status !== 'done').length}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Overdue</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex gap-1 p-1 rounded-lg mb-6 inline-flex"
        style={{ background: 'var(--bg-secondary)' }}
      >
        {['all', 'todo', 'in-progress', 'done', 'overdue'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
            style={{
              background: filter === f ? 'var(--color-primary)' : 'transparent',
              color: filter === f ? 'white' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {f === 'all' ? 'All' : f === 'todo' ? 'To Do' : f === 'in-progress' ? 'In Progress' : f === 'done' ? 'Done' : 'Overdue'}
          </button>
        ))}
      </div>

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        onStatusChange={handleStatusChange}
        isAdmin={isAdmin}
        emptyMessage={filter === 'all' ? 'No tasks assigned to you yet' : `No ${filter} tasks`}
      />
    </div>
  );
};

export default Tasks;
