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
  Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#fbbf24', '#34d399', '#f87171'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-lg border border-slate-700 shadow-lg">
        <p className="text-white text-sm font-medium">{payload[0].name}</p>
        <p className="text-indigo-400 text-sm">{payload[0].value} tasks</p>
      </div>
    );
  }
  return null;
};

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

      {/* PIE */}
      <div className="rounded-2xl p-6 border border-slate-700 bg-slate-800/40 backdrop-blur-md shadow-lg">
        <h3 className="text-base font-semibold text-white mb-5">
          Task Distribution
        </h3>

        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BAR */}
      <div className="rounded-2xl p-6 border border-slate-700 bg-slate-800/40 backdrop-blur-md shadow-lg">
        <h3 className="text-base font-semibold text-white mb-5">
          Overview
        </h3>

        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="total"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default TaskAnalytics;