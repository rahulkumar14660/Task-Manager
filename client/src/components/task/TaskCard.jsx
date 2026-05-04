import { Clock, User, Calendar, AlertTriangle } from 'lucide-react';
import { formatDate, getStatusLabel, getStatusBadgeClass, isOverdue } from '../../utils/helpers';

/**
 * Individual task card component
 */
const TaskCard = ({ task, onStatusChange, onDelete, isAdmin = false }) => {
  const overdue = isOverdue(task.dueDate, task.status);

  const handleStatusChange = (e) => {
    if (onStatusChange) {
      onStatusChange(task._id, e.target.value);
    }
  };

  return (
    <div
      className={`card relative ${overdue ? 'animate-pulse-glow' : ''}`}
      style={overdue ? { borderColor: 'rgba(239, 68, 68, 0.4)' } : {}}
    >
      {/* Overdue Indicator */}
      {overdue && (
        <div className="absolute -top-2 -right-2">
          <span className="badge badge-overdue text-xs">
            <AlertTriangle size={12} /> Overdue
          </span>
        </div>
      )}

      {/* Title & Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="text-sm font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
          {task.title}
        </h4>
        <span className={`badge ${getStatusBadgeClass(task.status)}`}>
          {getStatusLabel(task.status)}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {task.description}
        </p>
      )}

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <User size={13} />
          <span>{task.assignedTo?.name || 'Unassigned'}</span>
        </div>
        {task.dueDate && (
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: overdue ? 'var(--color-danger)' : 'var(--text-muted)' }}
          >
            <Calendar size={13} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
        {task.project?.title && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Clock size={13} />
            <span>{task.project.title}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-2 pt-3"
        style={{ borderTop: '1px solid var(--border-color)' }}
      >
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="input-field text-xs flex-1"
          style={{ padding: '0.4rem 0.6rem' }}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {isAdmin && onDelete && (
          <button
            onClick={() => onDelete(task._id)}
            className="btn btn-danger btn-sm"
            style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
