const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelog')
        .setDescription("Displays the changes made in each version of KemonoBot."),
    async execute(interaction) {
        await interaction.reply(`
0.5.0 Rewrite
0.5.1 Temporarily disabled embeds with descriptions that are too long.
0.5.2 Autocomplete results are no longer case sensitive.
0.5.3 Fixed embeds whose descriptions are too long with multiple messages that reply to the prior.
0.5.4 Updated /list printout with embedded links.
0.5.5 Added creator service to /add autocomplete results
0.5.6 Added creator service to /del, /sub, and /unsub autocomplete results.
0.5.7 Updated /list printout. Improved autocomplete response time.
0.5.8 /add ing creators adds their also adds their posts without sending 50 messages. No more spam.
0.5.9 Vastly improved API fetch time. Added /help and /changelog commands.`);
    },
};