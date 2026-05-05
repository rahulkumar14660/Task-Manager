import TaskCard from './TaskCard';
import { ListTodo } from 'lucide-react';

const TaskList = ({
  tasks = [],
  onStatusChange,
  onDelete,
  isAdmin = false,
  emptyMessage = 'No tasks found',
}) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-slate-700 bg-slate-800/40 backdrop-blur-md">
        
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-slate-700/50">
          <ListTodo size={26} className="text-slate-400" />
        </div>

        <p className="text-sm text-slate-300 text-center max-w-xs">
          {emptyMessage}
        </p>

        <button className="mt-4 px-4 py-2 text-sm rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition">
          Create Task
        </button>
      </div>
    );
  }

  return (
    <div className="max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tasks.map((task, index) => (
          <div
            key={task._id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 40}ms` }}
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
    </div>
  );
};

export default TaskList;