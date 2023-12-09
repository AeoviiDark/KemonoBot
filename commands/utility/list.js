const { SlashCommandBuilder } = require('discord.js');
const { listCreators } = require('../../lib/dbms.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription("List all creators in this channel's feed."),
    async execute(interaction) {
        listCreators(interaction)
            .then(creators => {
                if (!creators.length) {
                    interaction.reply(`There are no creators in <#${interaction.channelId}>`);
                    return
                }
                let res = ""
                for (let creator of creators){
                    console.log(creator);
                    res += `${creator.name}\n\
                    id:\t\t\t${creator.id}\n\
                    service:  ${creator.service}\n\
                    website: ${creator.website}\n`
                }
                console.log(res)
                interaction.reply(res);
            })
    },
};