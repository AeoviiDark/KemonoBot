const { SlashCommandBuilder } = require('discord.js');
const { lookupId, lookupName } = require('../../lib/util.js');
const { addCreator, read } = require('../../lib/dbms.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription("Add a creator to this channel's feed.")
        .addStringOption(option =>
            option
                .setName('nameurl')
                .setDescription('The name or URL of the creator. Ex: JohnDoe OR https://kemono.su/{service}/user/{userId}')
                .setRequired(true)
                .setAutocomplete(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const kemono = await read("./data/creators-kemono.json")
        const coomer = await read("./data/creators-coomer.json")
        const data = kemono.concat(coomer);
        const choices = Object.values(data).map(creator => creator.name);
        let filtered = choices.filter(choice => choice.startsWith(focusedValue));
        filtered = filtered.slice(0, 25);
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
    async execute(interaction) {
        const input = interaction.options.getString('nameurl');
        let foundCreator;
        if (input.split('/')[0] !== 'https:') {
            foundCreator = await lookupName(input);
            if (foundCreator === undefined) { interaction.reply(`There is no creator with the name "${input}".`); return; }
        } else {
            foundCreator = await lookupId(input.split('/')[5]);
            if (foundCreator === undefined) { interaction.reply(`The url cannot be resolved.`); return; }
        }
        addCreator(interaction, foundCreator)
            .then(res => {
                interaction.reply(res);
                console.log(res)
            })
    }
}
