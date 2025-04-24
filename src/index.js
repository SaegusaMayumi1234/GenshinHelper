import { GatewayIntentBits, Partials } from 'discord.js';

import './utils/uncaughtError.js';
import config from './config/index.js';
import db from './storages/mongodb/index.js';
import BaseClient from './models/baseClient.js';
import { registerEvents } from './handlers/eventsHandler.js';
import { registerCommands } from './handlers/commandsHandler.js';

const client = new BaseClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
  partials: [Partials.Channel, Partials.Message],
});

(async () => {
  await db.mongoose.connect(config.MONGODB_URI, {
    dbName: config.MONGODB_NAME,
  });

  await registerEvents(client, './src/events');
  await registerCommands(client, './src/commands');

  client.login(config.DISCORD_TOKEN);
})();
