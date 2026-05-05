const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

/**
 * Server Entry Point
 */
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode`);
      console.log(`Port: ${env.PORT}`);
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Promise Rejection:', err.message);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err.message);
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down...');
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();