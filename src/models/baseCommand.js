import { SlashCommandBuilder } from '@discordjs/builders';

/**
 * Base class for all command handlers.
 * Provides common functionality for permission checks, owner-only commands, guild/channel restrictions, etc.
 */
export default class BaseCommand {
  /**
   * Creates an instance of the BaseCommand.
   * @param {import('./baseClient.js').default} client - The Discord client.
   */
  constructor(client) {
    /**
     * The Discord client instance used for interaction with the Discord API.
     * @type {import('./baseClient.js').default}
     */
    this.client = client;

    /**
     * The data for the slash command, including name and description.
     * @type {SlashCommandBuilder}
     */
    this.data = new SlashCommandBuilder();

    /**
     * The permissions required for the user to execute the command.
     * This is an array of permission flags.
     * @type {import('discord.js').PermissionFlags[]}
     */
    this.permissions = [];

    /**
     * Whether this command can only be used by the bot owner.
     * If true, only the bot owner can use this command.
     * @type {boolean}
     */
    this.ownerOnly = false;

    /**
     * Whether this command will be registered as global command
     * If true, this command will be registered as global command using deploy command
     * @type {boolean}
     */
    this.global = false;

    /**
     * Whether this command can only be used in specific guilds.
     * If true, the command is restricted to certain guilds.
     * @type {string[]}
     */
    this.guildOnly = [];

    /**
     * Whether this command can only be used in specific channels.
     * If true, the command is restricted to certain channels within a guild.
     * @type {string[]}
     */
    this.channelOnly = [];
  }

  /**
   * Template method that is used to execute the command logic.
   * @param {import('discord.js').Interaction} interaction - The interaction object for the command.
   * @throws {Error} Throws an error if this method is not implemented by a subclass.
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    // Check if the command is owner-only
    if (this.ownerOnly && interaction.user.id !== interaction.client.ownerID) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    // Check user permissions if defined
    if (this.permissions.length > 0 && !interaction.memberPermissions.has(this.permissions)) {
      return interaction.reply({ content: 'You do not have the required permissions to run this command.', ephemeral: true });
    }

    // Check if the command is allowed only in certain guilds
    if (this.guildOnly.length > 0 && !this.guildOnly.includes(interaction.guildId)) {
      return interaction.reply({ content: 'This command is not allowed in this guild.', ephemeral: true });
    }

    // Check if the command is allowed only in certain channels
    if (this.channelOnly.length > 0 && !this.channelOnly.includes(interaction.channelId)) {
      return interaction.reply({ content: 'This command is not allowed in this channel.', ephemeral: true });
    }

    // Execute the command logic (override in child class)
    await this.run(interaction);
  }

  /**
   * The command-specific logic that should be implemented in child classes.
   * @param {import('discord.js').Interaction} interaction - The interaction object for the command.
   * @throws {Error} Throws an error if this method is not implemented by a subclass.
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async run(interaction) {
    // default behavior
    throw new Error('run method must be implemented by subclass.');
  }

  /**
   * Handles the autocomplete interaction for the command arguments.
   * @param {import('discord.js').Interaction} interaction - The interaction object for the autocomplete.
   * @returns {void}
   */
  async autocomplete(interaction) {
    // default behavior
    return interaction.respond([]);
  }
}