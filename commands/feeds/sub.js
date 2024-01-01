const { SlashCommandBuilder } = require('discord.js');
const { lookupId } = require('../../lib/util.js');
const { read, addSub } = require('../../lib/dbms.js');

let data = null;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sub')
        .setDescription("Subscribe to a creator in this channel's feed.")
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The creator for which you want to recieve post notifications for.')
                .setRequired(true)
                .setAutocomplete(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        if (data === null) {
            data = await read()
        }
        if (data[interaction.guildId] === undefined) {return;}
        if (data[interaction.guildId][interaction.channelId] === undefined) {return;}
        const filtered = Object.values(data[interaction.guildId][interaction.channelId]).filter(creator => creator.name.toLowerCase().startsWith(focusedValue.toLowerCase()) && !creator.subscribers.includes(interaction.member.id)).slice(0,25);
        await interaction.respond(filtered.map(choice => ({ name: `${choice.name} [${choice.service}]`, value: choice.id.split(' ')[0] })));
    },
    async execute(interaction) {
        const input = interaction.options.getString('name');
        const foundCreator = await lookupId(input);
        if (foundCreator === undefined) { interaction.reply(`This creator does not exist in <#${interaction.channelId}>`); return; }
        addSub(interaction, foundCreator)
            .then(res => {
                interaction.reply(res);
            })
    }
};
