import { SlashCommandBuilder } from 'discord.js';
import BaseCommand from '../models/baseCommand.js';
import logger from '../utils/logger.js';

export default class TestCommand extends BaseCommand {
  constructor(client) {
    super(client);
    this.data = new SlashCommandBuilder().setName('test').setDescription('test command');
  }

  /**
   * Main entry function when command is executed.
   * @param {import('discord.js').Interaction} interaction - The interaction object for the command.
   * @returns {Promise<void>}
   */
  async run(interaction) {
    logger.info(`Discord Bot client logged in as ${this.client.user.tag}!`);
  }
}
