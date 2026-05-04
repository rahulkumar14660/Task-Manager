/**
 * Application-wide constants
 * Centralized enum-like values for roles and task statuses
 */

const ROLES = Object.freeze({
  ADMIN: 'admin',
  MEMBER: 'member',
});

const TASK_STATUS = Object.freeze({
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
});

const TASK_STATUS_VALUES = Object.values(TASK_STATUS);
const ROLE_VALUES = Object.values(ROLES);

module.exports = {
  ROLES,
  TASK_STATUS,
  TASK_STATUS_VALUES,
  ROLE_VALUES,
};
