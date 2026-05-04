import TaskCard from './TaskCard';
import { ListTodo } from 'lucide-react';

/**
 * Task list component with optional status filtering
 */
const TaskList = ({ tasks = [], onStatusChange, onDelete, isAdmin = false, emptyMessage = 'No tasks found' }) => {
  if (tasks.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 rounded-xl"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'var(--bg-tertiary)' }}
        >
          <ListTodo size={28} style={{ color: 'var(--text-muted)' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {tasks.map((task, index) => (
        <div
          key={task._id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <TaskCard
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            isAdmin={isAdmin}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
