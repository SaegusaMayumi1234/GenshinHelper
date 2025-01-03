import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

import logger from '../utils/logger.js';

/**
 * Dynamically loads and registers events for a Discord.js client.
 * @param {import('discord.js').Client} client - The Discord.js client instance.
 * @param {string} eventsDir - Path to the directory containing event files.
 */
export async function registerEvents(client, eventsDir) {
  const rootDir = process.cwd(); // Project root directory
  const eventsPath = path.join(rootDir, eventsDir); // Absolute path to events directory

  const eventFiles = readdirSync(eventsDir).filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    try {
      const filePath = path.join(eventsPath, file);
      const event = await import(pathToFileURL(filePath).href);
      if (!event || !event.default) {
        logger.error(`Event file "${file}" does not export a default handler.`);
        continue;
      }

      const { name, once, execute } = event.default;

      if (!name || typeof name !== 'string') {
        logger.error(`Event file "${file}" is missing a valid "name" property.`);
        continue;
      }

      if (once) {
        client.once(name, (...args) => execute(...args, client));
      } else {
        client.on(name, (...args) => execute(...args, client));
      }

      logger.info(`Event "${name}" has been registered successfully from file "${file}".`);
    } catch (error) {
      logger.error(`Failed to load event file "${file}"`, error);
    }
  }
}
