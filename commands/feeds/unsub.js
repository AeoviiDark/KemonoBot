const { SlashCommandBuilder } = require('discord.js');
const { lookupName } = require('../../lib/util.js');
const { read, delSub } = require('../../lib/dbms.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unsub')
        .setDescription("Unsubscribe from a creator in this channel's feed.")
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The creator for which you want to stop receiving post notifications for.')
                .setRequired(true)
                .setAutocomplete(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const data = await read()
        if (data[interaction.guildId] === undefined) {return;}
        if (data[interaction.guildId][interaction.channelId] === undefined) {return;}
        let choices = Object.values(data[interaction.guildId][interaction.channelId]).filter(creator => creator.subscribers.includes(interaction.member.id))
        choices = choices.map(creator => creator.name);
        let filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedValue.toLowerCase()));
        filtered = filtered.splice(0,25);
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
    async execute(interaction) {
        const input = interaction.options.getString('name');
        const foundCreator = await lookupName(input);
        if (foundCreator === undefined) { interaction.reply(`This creator does not exist in <#${interaction.channelId}>`); return; }
        delSub(interaction, foundCreator)
            .then(res => {
                interaction.reply(res);
            })
    }
};