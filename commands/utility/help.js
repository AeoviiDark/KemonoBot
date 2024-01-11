const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Show a list of commands and their usage."),
    async execute(interaction) {
        await interaction.reply(`
**/add** {name} | {url}
> Add a creator to the current channel.
**/del** {name} | all
> Delete a creator from the current channel. Delete all creators with /del all
**/sub** {name}
> Subscribe to a creator in the channel. You will be mentioned when a creator you've subscribed to posts.
**/unsub** {name}
> Unsubscribe from a creator in the channel.
**/list**
> List all creators in the current channel along with some additional information.
**/version**
> Displays the current version of KemonoBot.
**/changelog**
> Displays the changes made in each version of KemonoBot.
**/help**
> Show a list of commands and their usage. (You're here!)
        `);
    },
};