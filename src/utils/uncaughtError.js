import logger from './logger.js';

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

// process.on('uncaughtExceptionMonitor', (error, origin) => {
//   logger.error('Uncaught Exception (MONITOR):', error);
// });

// process.on('multipleResolves', (type, promise, reason) => {
//   client.logger.error('Multiple Resolves:', reason);
// });
