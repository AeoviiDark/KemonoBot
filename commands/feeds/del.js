const { SlashCommandBuilder } = require('discord.js');
const { lookupId } = require('../../lib/util.js');
const { read, delCreator } = require('../../lib/dbms.js');

let data = null;

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
        if (data === null) {
            data = await read()
        }
        if (data[interaction.guildId] === undefined) {return;}
        if (data[interaction.guildId][interaction.channelId] === undefined) {return;}
        const filtered = Object.values(data[interaction.guildId][interaction.channelId]).filter(creator => creator.name.toLowerCase().startsWith(focusedValue.toLowerCase())).slice(0,25);
        await interaction.respond(filtered.map(choice => ({ name: `${choice.name} [${choice.service}]`, value: choice.id.split(' ')[0] })));
    },
    async execute(interaction) {
        const input = interaction.options.getString('name');
        if (input === 'all') { 
            delCreator(interaction)
            interaction.reply(`Deleted all creators from <#${interaction.channelId}>`); 
            return; 
        }
        const foundCreator = await lookupId(input);
        if (foundCreator === undefined) { interaction.reply(`This creator does not exist in <#${interaction.channelId}>`); return; }
        delCreator(interaction, foundCreator)
            .then(res => {
                interaction.reply(res);
                console.log(res)
            })
    }
}