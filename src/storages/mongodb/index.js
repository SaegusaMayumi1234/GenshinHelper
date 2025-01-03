import mongoose from 'mongoose';

import logger from '../../utils/logger.js';

export default {
  mongoose,
};

mongoose.connection.on('error', (error) => {
  logger.error('[Mongoose]', error);
});

mongoose.connection.on('connecting', () => {
  logger.info('[Mongoose] Connecting to MongoDB');
});

mongoose.connection.on('connected', () => {
  logger.info('[Mongoose] Connected to MongoDB');
});

mongoose.connection.on('disconnecting', () => {
  logger.info('[Mongoose] Disconnecting from MongoDB');
});

mongoose.connection.on('disconnected', () => {
  logger.info('[Mongoose] Disconnected from MongoDB');
});
