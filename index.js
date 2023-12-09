const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { eventHandler } = require('./event-handler.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

eventHandler(client);

client.login(token);