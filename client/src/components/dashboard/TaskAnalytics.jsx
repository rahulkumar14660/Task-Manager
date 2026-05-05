import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#6366f1', '#fbbf24', '#34d399', '#f87171'];

const TaskAnalytics = ({ stats }) => {
  const pieData = [
    { name: 'To Do', value: stats?.todoCount || 0 },
    { name: 'In Progress', value: stats?.inProgressCount || 0 },
    { name: 'Completed', value: stats?.doneCount || 0 },
    { name: 'Overdue', value: stats?.overdueCount || 0 },
  ];

  const barData = [
    { name: 'Tasks', total: stats?.totalTasks || 0 },
    { name: 'Projects', total: stats?.projectCount || 0 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Pie Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Task Distribution
        </h3>

        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Overview
        </h3>

        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default TaskAnalytics;