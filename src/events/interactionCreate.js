import { Events, MessageFlags } from 'discord.js';
import BaseEvent from '../models/baseEvent.js';
import logger from '../utils/logger.js';

export default class InteractionCreateEvent extends BaseEvent {
  constructor(client) {
    super(client);
    this.name = Events.InteractionCreate;
  }

  /**
   * @param {import('discord.js').Interaction} interaction - The interaction object
   */
  async handle(interaction) {
    if (!interaction.isChatInputCommand()) return;
    
    if (interaction.isCommand()) {
      const command = this.client.commands.get(interaction.commandName);

      if (!command) {
        await interaction.reply({ content: `There was an error while executing {interaction.commandName} command! (command doesn't exist)`, flags: MessageFlags.Ephemeral });
        return;
      };

      try {
        await command.execute(interaction);
      } catch (error) {
        logger.error(`There was an error while executing ${interaction.commandName} command!`, error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: `There was an error while executing ${interaction.commandName} command!`, flags: MessageFlags.Ephemeral });
        } else {
          await interaction.reply({ content: `There was an error while executing ${interaction.commandName} command!`, flags: MessageFlags.Ephemeral });
        }
      }
    } else if (interaction.isAutocomplete()) {
      const command = this.client.commands.get(interaction.commandName);
      if (!command) {
        await interaction.respond([]);
      };
    }
  }
}
