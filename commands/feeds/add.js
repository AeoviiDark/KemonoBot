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
        const filtered = Object.values(data).filter(creator => creator.name.toLowerCase().startsWith(focusedValue.toLowerCase())).slice(0,25);
        await interaction.respond(
            filtered.map(choice => ({ name: `${choice.name} [${choice.service}]`, value: choice.id.split(' ')[0] })),
        );
    },
    async execute(interaction) {
        const input = interaction.options.getString('nameurl');
        console.log("the guy", input)
        const foundCreator = await lookupId(input);
        if (foundCreator === undefined) { interaction.reply(`The creator cannot be found.`); return; }
        addCreator(interaction, foundCreator)
            .then(res => {
                interaction.reply(res);
                console.log(res)
            })
    }
}
