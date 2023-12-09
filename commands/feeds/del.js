const { SlashCommandBuilder } = require('discord.js');
const { lookupName } = require('../../lib/util.js');
const { read, delCreator } = require('../../lib/dbms.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('del')
        .setDescription("Delete a creator from this channel's feed.")
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The name of the creator you want to delete.')
                .setRequired(true)
                .setAutocomplete(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const data = await read()
        if (data[interaction.guildId] === undefined) {return;}
        if (data[interaction.guildId][interaction.channelId] === undefined) {return;}
        const choices = Object.values(data[interaction.guildId][interaction.channelId]).map(creator => creator.name);
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
    async execute(interaction) {
        const input = interaction.options.getString('name');
        if (input === 'all') { 
            delCreator(interaction)
            interaction.reply(`Deleted all creators from <#${interaction.channelId}>`); 
            return; 
        }
        const foundCreator = await lookupName(input);
        if (foundCreator === undefined) { interaction.reply(`This creator does not exist in <#${interaction.channelId}>`); return; }
        delCreator(interaction, foundCreator)
            .then(res => {
                interaction.reply(res);
            })
    }
}