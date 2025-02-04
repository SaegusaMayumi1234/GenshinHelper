import BaseEvent from '../models/baseEvent.js';
import logger from '../utils/logger.js';

export default class ReadyEvent extends BaseEvent {
  constructor(client) {
    super(client);
    this.name = 'ready';
    this.once = true;
  }

  async handle() {
    logger.info(`Discord Bot client logged in as ${this.client.user.tag}!`);
  }
}
