import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

import logger from '../utils/logger.js';
import BaseEvent from '../models/baseEvent.js';

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
      const eventFile = await import(pathToFileURL(filePath).href);
      if (!eventFile || !eventFile.default) {
        logger.error(`Skipping event file "${file}" as it does not export a default handler.`);
        continue;
      }

      const EventClass = eventFile.default;
      if (!(EventClass.prototype instanceof BaseEvent)) {
        logger.error(`Skipping event file "${file}" as it does not extend BaseEvent.`);
        continue;
      }

      /**
       * Event class extended from BaseEvent.
       * @type {BaseEvent}
       */
      const event = new EventClass(client);
      if (!event.name || event.name === '') {
        logger.error(`Skipping event file "${file}" as it does not specify event name.`);
        continue;
      }

      const handler = (...args) => event.handle(...args);
      if (event.once) {
        client.once(event.name, handler);
      } else {
        client.on(event.name, handler);
      }

      logger.info(`Loaded event listener "${event.name}" from file "${file}".`);
    } catch (error) {
      logger.error(`Failed to load event file "${file}"`, error);
    }
  }
}
