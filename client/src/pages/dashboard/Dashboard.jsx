import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import taskAPI from '../../api/task.api';
import TaskList from '../../components/task/TaskList';
import { toast } from 'react-hot-toast';

/**
 * Dashboard Page — Overview of tasks, statuses, and overdue items
 */
const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await taskAPI.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      toast.error('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTask(taskId, { status: newStatus });
      toast.success('Task status updated');
      fetchDashboard();
    } catch (err) {
      toast.error(err.message || 'Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats?.totalTasks || 0,
      icon: ListTodo,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.12)',
      border: 'rgba(99, 102, 241, 0.3)',
    },
    {
      label: 'To Do',
      value: stats?.todoCount || 0,
      icon: Clock,
      color: '#818cf8',
      bg: 'rgba(129, 140, 248, 0.12)',
      border: 'rgba(129, 140, 248, 0.3)',
    },
    {
      label: 'In Progress',
      value: stats?.inProgressCount || 0,
      icon: TrendingUp,
      color: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.12)',
      border: 'rgba(251, 191, 36, 0.3)',
    },
    {
      label: 'Completed',
      value: stats?.doneCount || 0,
      icon: CheckCircle2,
      color: '#34d399',
      bg: 'rgba(52, 211, 153, 0.12)',
      border: 'rgba(52, 211, 153, 0.3)',
    },
    {
      label: 'Overdue',
      value: stats?.overdueCount || 0,
      icon: AlertTriangle,
      color: '#f87171',
      bg: 'rgba(248, 113, 113, 0.12)',
      border: 'rgba(248, 113, 113, 0.3)',
    },
    {
      label: 'Projects',
      value: stats?.projectCount || 0,
      icon: FolderKanban,
      color: '#a78bfa',
      bg: 'rgba(167, 139, 250, 0.12)',
      border: 'rgba(167, 139, 250, 0.3)',
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <LayoutDashboard size={28} style={{ color: 'var(--color-primary)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Dashboard
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Welcome back, <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{user?.name}</span>!
          {isAdmin ? ' Here\'s your team overview.' : ' Here are your assigned tasks.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 transition-all duration-200 hover:scale-105 animate-fade-in"
            style={{
              background: stat.bg,
              border: `1px solid ${stat.border}`,
              animationDelay: `${index * 70}ms`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <p className="text-2xl font-bold mb-0.5" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Tasks */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Recent Tasks
        </h2>
        <TaskList
          tasks={stats?.recentTasks || []}
          onStatusChange={handleStatusChange}
          isAdmin={isAdmin}
          emptyMessage="No tasks yet. Create a project and start adding tasks!"
        />
      </div>
    </div>
  );
};

export default Dashboard;
