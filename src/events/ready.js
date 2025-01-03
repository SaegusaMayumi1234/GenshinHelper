import logger from '../utils/logger.js';

export default {
  name: 'ready',
  once: true,
  /**
   *
   * @param {import('discord.js').Client} client - The main client instance for interacting with the Discord API.
   */
  async execute(client) {
    logger.info(`Discord Bot client logged in as ${client.user.tag}!`);
  },
};
