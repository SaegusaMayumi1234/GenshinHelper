import { Client, Collection } from "discord.js";

export default class BaseClient extends Client {
  /**
   * @param {import('discord.js').ClientOptions} options - Options for the Discord client
   */
  constructor(options) {
    super(options);
    
    /**
     * Commands collection
     * @type {Collection<string, import('./baseCommand.js').default>}
     */
    this.commands = new Collection();
  }
}