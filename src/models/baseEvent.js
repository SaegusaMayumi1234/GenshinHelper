/**
 * Base class for all event handlers.
 * Provides the structure for handling different types of events.
 */
export default class BaseEvent {
  /**
   * Creates an instance of the BaseEvent.
   * @param {import('discord.js').Client} client - The Discord client.
   */
  constructor(client) {
    /**
     * The Discord client instance used for interaction with the Discord API.
     * @type {import('discord.js').Client}
     */
    this.client = client;
    
    /**
     * The name of the event to listen for (e.g., 'ready', 'interactionCreate').
     * @type {string}
     */
    this.name = '';

    /**
     * Whether this event handler should be triggered once and then removed.
     * @type {boolean}
     */
    this.once = false;
  }
  
  /**
   * Template method for event handling.
   * @param {...any} args - The arguments for the event.
   * @throws {Error} Throws an error if this method is not implemented by a subclass.
   */
  // eslint-disable-next-line no-unused-vars
  async handle(...args) {
    throw new Error('handle method must be implemented by subclass.');
  }
}