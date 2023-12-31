const { Events } = require('discord.js');
const { interval } = require('../config.json');
const { updateLocal, updateFeeds } = require('../lib/api.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await updateLocal()
		console.log(`Ready! Logged in as ${client.user.tag}`);
		updateFeeds(client);
		setInterval(async () => {updateFeeds(client);}, interval*60*1000)


		// client.users.fetch('893511129542819890', false).then((user) => {
		// 	user.send('Beep boop. Use "/" to check out the available commands.');
		// });
	},
};