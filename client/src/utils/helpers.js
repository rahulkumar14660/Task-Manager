/**
 * Utility / Helper functions for the frontend
 */

/**
 * Format a date string to a readable format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date for input[type="date"] value
 * @param {string|Date} date - Date to format
 * @returns {string} YYYY-MM-DD format
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

/**
 * Check if a task is overdue
 * @param {string|Date} dueDate - Task due date
 * @param {string} status - Task status
 * @returns {boolean} True if overdue
 */
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'done') return false;
  return new Date() > new Date(dueDate);
};

/**
 * Get display label for task status
 * @param {string} status - Status enum value
 * @returns {string} Human-readable label
 */
export const getStatusLabel = (status) => {
  const labels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done',
  };
  return labels[status] || status;
};

/**
 * Get CSS class for status badge
 * @param {string} status - Task status
 * @returns {string} CSS class name
 */
export const getStatusBadgeClass = (status) => {
  const classes = {
    'todo': 'badge-todo',
    'in-progress': 'badge-in-progress',
    'done': 'badge-done',
  };
  return classes[status] || '';
};

/**
 * Truncate text to a max length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum characters
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Calculate time ago from a date
 * @param {string|Date} date - Date to calculate from
 * @returns {string} Human-readable time ago string
 */
export const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};
