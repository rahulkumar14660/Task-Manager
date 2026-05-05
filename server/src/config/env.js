const dotenv = require('dotenv');

// Load .env ONLY for local development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

/**
 * Centralized environment configuration
 */
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  // IMPORTANT: Railway provides PORT dynamically
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,

  MONGODB_URI:
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017/team-task-manager',

  JWT_SECRET:
    process.env.JWT_SECRET || 'default_jwt_secret_change_me',

  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // FIX: Allow Railway requests
  CLIENT_URL: process.env.CLIENT_URL || '*',
};

// Validate only in production
if (env.NODE_ENV === 'production') {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missing.join(', ')}`
    );
    process.exit(1);
  }
}

module.exports = env;