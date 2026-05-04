import api from './axios';

/**
 * Project API service
 */
const projectAPI = {
  /**
   * Create a new project (Admin only)
   * @param {Object} data - { title, description }
   */
  createProject: (data) => api.post('/projects', data),

  /**
   * Get all projects for current user
   */
  getProjects: () => api.get('/projects'),

  /**
   * Get a single project by ID
   * @param {string} id - Project ID
   */
  getProjectById: (id) => api.get(`/projects/${id}`),

  /**
   * Add a member to a project (Admin only)
   * @param {string} projectId - Project ID
   * @param {string} email - Member's email
   */
  addMember: (projectId, email) =>
    api.post(`/projects/${projectId}/members`, { email }),

  /**
   * Remove a member from a project (Admin only)
   * @param {string} projectId - Project ID
   * @param {string} userId - User ID to remove
   */
  removeMember: (projectId, userId) =>
    api.delete(`/projects/${projectId}/members/${userId}`),
};

export default projectAPI;
