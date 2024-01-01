const { SlashCommandBuilder } = require('discord.js');
const { read, listCreators } = require('../../lib/dbms.js');

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
                    res += `
**${creator.name}**
> id:\t\t\t${creator.id}
> service:  ${creator.service}
> website: [${creator.website}.party](<https://${creator.website}.su/${creator.service}/user/${creator.id}>)
`;
                }
                console.log(res)
                interaction.reply(res);
            })
    },
};