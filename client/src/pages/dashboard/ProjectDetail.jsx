import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Plus,
  UserPlus,
  X,
  Loader2,
  Mail,
  Trash2,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import projectAPI from '../../api/project.api';
import taskAPI from '../../api/task.api';
import TaskList from '../../components/task/TaskList';
import TaskForm from '../../components/task/TaskForm';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { getInitials } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

/**
 * Single project detail page — members, tasks, management
 */
const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchProject = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectAPI.getProjectById(id),
        taskAPI.getTasksByProject(id),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleCreateTask = async (data) => {
    const response = await taskAPI.createTask(data);
    toast.success('Task created successfully!');
    setTasks([response.data, ...tasks]);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTask(taskId, { status: newStatus });
      toast.success('Task status updated');
      setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
    } catch (err) {
      toast.error(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskAPI.deleteTask(taskId);
      toast.success('Task deleted');
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) return;

    setAddingMember(true);
    try {
      const response = await projectAPI.addMember(id, memberEmail);
      toast.success('Member added successfully!');
      setProject(response.data);
      setMemberEmail('');
      setShowAddMember(false);
    } catch (err) {
      toast.error(err.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from this project?`)) return;
    try {
      const response = await projectAPI.removeMember(id, memberId);
      toast.success('Member removed');
      setProject(response.data);
    } catch (err) {
      toast.error(err.message || 'Failed to remove member');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (!project) return null;

  const isProjectAdmin = project.createdBy?._id === user?.id || project.createdBy?._id === user?._id;

  return (
    <div>
      {/* Back Button & Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="btn btn-ghost btn-sm mb-4"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {project.title}
            </h1>
            {project.description && (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {project.description}
              </p>
            )}
          </div>
          {isAdmin && isProjectAdmin && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowAddMember(true)}>
                <UserPlus size={16} />
                Add Member
              </Button>
              <Button size="sm" onClick={() => setShowTaskForm(true)}>
                <Plus size={16} />
                New Task
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Members Section */}
      <div className="mb-8">
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Users size={18} style={{ color: 'var(--color-primary)' }} />
          Team Members ({project.members?.length || 0})
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.members?.map((member) => (
            <div
              key={member._id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: member._id === (project.createdBy?._id)
                    ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'
                    : 'var(--bg-tertiary)',
                  color: 'white',
                }}
              >
                {getInitials(member.name)}
              </div>
              <div>
                <p className="text-sm font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {member.name}
                </p>
                <p className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
                  {member.email}
                </p>
              </div>
              <span className={`badge text-xs ml-1 ${member.role === 'admin' ? 'badge-admin' : 'badge-member'}`}>
                {member.role}
              </span>
              {isAdmin && isProjectAdmin && member._id !== project.createdBy?._id && (
                <button
                  onClick={() => handleRemoveMember(member._id, member.name)}
                  className="ml-1 p-1 rounded hover:bg-red-500/20 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  title="Remove member"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            Tasks ({tasks.length})
          </h2>

          {/* Filter Tabs */}
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
            {['all', 'todo', 'in-progress', 'done'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
                style={{
                  background: filter === f ? 'var(--color-primary)' : 'transparent',
                  color: filter === f ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {f === 'all' ? 'All' : f === 'todo' ? 'To Do' : f === 'in-progress' ? 'In Progress' : 'Done'}
              </button>
            ))}
          </div>
        </div>

        <TaskList
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteTask}
          isAdmin={isAdmin && isProjectAdmin}
          emptyMessage="No tasks match the filter"
        />
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowAddMember(false)}
        >
          <div
            className="w-full max-w-md rounded-xl p-6 animate-fade-in"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <UserPlus size={20} style={{ color: 'var(--color-primary)' }} />
                Add Team Member
              </h2>
              <button onClick={() => setShowAddMember(false)} className="btn btn-ghost btn-sm">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddMember}>
              <Input
                label="Member Email"
                name="memberEmail"
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Enter member's email address"
                icon={Mail}
                required
              />
              <div className="flex gap-3 justify-end">
                <Button variant="secondary" onClick={() => setShowAddMember(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={addingMember}>
                  Add Member
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskForm && (
        <TaskForm
          projectId={id}
          members={project.members || []}
          onSubmit={handleCreateTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
