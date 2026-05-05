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
import TaskAnalytics from '../../components/dashboard/TaskAnalytics';
import { toast } from 'react-hot-toast';

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
        <Loader2 size={32} className="animate-spin text-indigo-500" />
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
    <div className="max-w-7xl mx-auto space-y-12">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <LayoutDashboard size={28} className="text-indigo-500" />
          <h1 className="text-2xl font-bold text-white">
            Dashboard
          </h1>
        </div>

        <p className="text-sm text-slate-400">
          Welcome back,{' '}
          <span className="font-semibold text-white">{user?.name}</span>!
          {isAdmin
            ? " Here's your team overview."
            : ' Here are your assigned tasks.'}
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.9))',
              border: `1px solid ${stat.border}`,
            }}
          >
            {/* Icon */}
            <div className="flex items-center justify-between mb-5">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{ background: stat.bg }}
              >
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
            </div>

            {/* Value */}
            <p
              className="text-3xl font-bold mb-1"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>

            {/* Label */}
            <p className="text-sm text-slate-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tasks Section */}
      <div className="card p-6 mt-4">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Recent Tasks
        </h2>

        <TaskList
          tasks={stats?.recentTasks || []}
          onStatusChange={handleStatusChange}
          isAdmin={isAdmin}
          emptyMessage="No tasks yet. Create a project and start adding tasks!"
        />
      </div>

      {/* Analytics Section */}
      <TaskAnalytics stats={stats} />

    </div>
  );
};

export default Dashboard;