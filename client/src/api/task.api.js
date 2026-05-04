import api from './axios';

/**
 * Task API service
 */
const taskAPI = {
  /**
   * Create a new task (Admin only)
   * @param {Object} data - { title, description, project, assignedTo, dueDate, status }
   */
  createTask: (data) => api.post('/tasks', data),

  /**
   * Get tasks for a specific project
   * @param {string} projectId - Project ID
   */
  getTasksByProject: (projectId) => api.get(`/tasks/project/${projectId}`),

  /**
   * Get tasks assigned to current user
   */
  getMyTasks: () => api.get('/tasks/my'),

  /**
   * Update a task
   * @param {string} taskId - Task ID
   * @param {Object} data - Fields to update
   */
  updateTask: (taskId, data) => api.put(`/tasks/${taskId}`, data),

  /**
   * Delete a task (Admin only)
   * @param {string} taskId - Task ID
   */
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),

  /**
   * Get dashboard statistics
   */
  getDashboardStats: () => api.get('/tasks/dashboard'),
};

export default taskAPI;
