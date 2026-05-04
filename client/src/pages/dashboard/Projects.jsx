import { useState, useEffect } from 'react';
import { FolderKanban, Plus, Loader2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import projectAPI from '../../api/project.api';
import ProjectCard from '../../components/project/ProjectCard';
import ProjectForm from '../../components/project/ProjectForm';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';

/**
 * Projects listing page
 */
const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getProjects();
      setProjects(response.data);
    } catch (err) {
      toast.error('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (data) => {
    const response = await projectAPI.createProject(data);
    toast.success('Project created successfully!');
    setProjects([response.data, ...projects]);
  };

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
            <FolderKanban size={28} style={{ color: 'var(--color-primary)' }} />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Projects
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {isAdmin ? 'Manage your team projects' : 'Projects you are part of'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={18} />
            New Project
          </Button>
        )}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-xl"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <FolderKanban size={36} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="text-base font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            No projects yet
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {isAdmin ? 'Create your first project to get started' : 'Wait for an admin to add you to a project'}
          </p>
          {isAdmin && (
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              <Plus size={18} />
              Create Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showForm && (
        <ProjectForm
          onSubmit={handleCreateProject}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Projects;
