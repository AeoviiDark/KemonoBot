const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Show a list of commands and their usage."),
    async execute(interaction) {
        await interaction.reply(`
        `);
    },
};