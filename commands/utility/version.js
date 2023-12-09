const { SlashCommandBuilder } = require('discord.js');
const { version } = require('../../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription("Displays KemonoBot's version"),
    async execute(interaction) {
        await interaction.reply(`KemonoBot ${version}`);
    },
};