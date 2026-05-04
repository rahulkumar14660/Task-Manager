import { useNavigate } from 'react-router-dom';
import { FolderKanban, Users, ListTodo, Calendar } from 'lucide-react';
import { formatDate, truncateText } from '../../utils/helpers';

/**
 * Project card component for the projects list
 */
const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card cursor-pointer"
      onClick={() => navigate(`/projects/${project._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/projects/${project._id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            }}
          >
            <FolderKanban size={20} color="white" />
          </div>
          <div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              {project.title}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              by {project.createdBy?.name || 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          {truncateText(project.description, 120)}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Users size={14} />
          <span>{project.members?.length || 0} members</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <ListTodo size={14} />
          <span>{project.taskCount || 0} tasks</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
          <Calendar size={14} />
          <span>{formatDate(project.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
