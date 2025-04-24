import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

import logger from '../utils/logger.js';
import BaseCommand from '../models/baseCommand.js';

/**
 * Dynamically loads and registers events for a Discord.js client.
 * @param {import('../models/baseClient.js').default} client - The Discord.js client instance.
 * @param {string} commandsDir - Path to the directory containing command files.
 */
export async function registerCommands(client, commandsDir) {
  const rootDir = process.cwd(); // Project root directory
  const commandsPath = path.join(rootDir, commandsDir); // Absolute path to events directory

  const commandFiles = readdirSync(commandsDir).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    try {
      const filePath = path.join(commandsPath, file);
      const commandFile = await import(pathToFileURL(filePath).href);
      if (!commandFile || !commandFile.default) {
        logger.error(`Skipping command file "${file}" as it does not export a default handler.`);
        continue;
      }

      const CommandClass = commandFile.default;
      if (!(CommandClass.prototype instanceof BaseCommand)) {
        logger.error(`Skipping command file "${file}" as it does not extend BaseCommand.`);
        continue;
      }

      /**
       * Command class extended from BaseCommand
       * @type {BaseCommand}
       */
      const command = new CommandClass(client);
      client.commands.set(command.data.name, command);

      logger.info(`Loaded command "${command.data.name}" from file "${file}".`);
    } catch (error) {
      logger.error(`Failed to load event file "${file}"`, error);
    }
  }
}
