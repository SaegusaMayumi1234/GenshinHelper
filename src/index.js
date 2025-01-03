import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';

import './utils/uncaughtError.js';
import config from './config/index.js';
import db from './storages/mongodb/index.js';
import { registerEvents } from './handlers/eventsHandler.js';

/**
 * @type {Client} - The main client instance for interacting with the Discord API.
 * @property {Collection} events - A collection to store event handlers.
 * @property {Collection} commands - A collection to store bot commands.
 */
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
  partials: [Partials.Channel, Partials.Message],
});

client.commands = new Collection();

(async () => {
  await db.mongoose.connect(config.MONGODB_URI, {
    dbName: config.MONGODB_NAME,
  });

  await registerEvents(client, './src/events');

  client.login(config.DISCORD_TOKEN);
})();
