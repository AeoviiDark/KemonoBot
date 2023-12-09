const { EmbedBuilder } = require('discord.js');
const TurndownService = require('turndown');
const turndownService = new TurndownService();
const fs = require('fs').promises;
const { read, write } = require('./dbms.js')

async function updateLocal() {
    try {
        await fs.access('./data');
    } catch (error) {
        try {
            await fs.mkdir('./data');
        } catch (error) {
            console.log('Error creating ./data', error);
            throw error;
        }
    }
    try {
        const kemonoList = await fetch('https://kemono.party/api/v1/creators.txt');
        if (!kemonoList.ok) {throw new Error(' Failed to fetch data from KemonoAPI');}
        const jsonData = await kemonoList.json();
        await write(jsonData, 'data/creators-kemono.json')
    } catch (error) {
        console.error("oopsie poopsie", error);
        throw error;
    }
    try {
        const coomerList = await fetch('https://coomer.party/api/v1/creators.txt');
        if (!coomerList.ok) {throw new Error(' Failed to fetch data from CoomerAPI');}
        const jsonData = await coomerList.json();
        await write(jsonData, 'data/creators-coomer.json')
    } catch (error) {
        console.error("oopsie poopsie", error);
        throw error;
    }
    console.log('Updated local.')
}

async function updateFeeds(client) {
    const data = await read();
    let updatecount = 0;
    console.log(`Starting scheduled scan...`);
    for (const serverId of Object.keys(data)) {
        for (const channelId of Object.keys(data[serverId])) {
            let channel = await client.channels.fetch(channelId);
            for (const creatorId of Object.keys(data[serverId][channelId])) {
                const creator = data[serverId][channelId][creatorId];
                const url = `https://${creator.website}.party/api/v1/${creator.service}/user/${creatorId}`
                const posts = await (await fetch(url)).json();
                const newPosts = posts.filter(post => !creator.posts.includes(post.id))
                for (let newPost of newPosts) {
                    updatecount += 1;
                    creator.posts.push(newPost.id);
                    const msg = await embedPost(creator, creatorId, newPost);
                    await channel.send({ embeds: [msg] });
                }
            }
        }
    }
    await write(data);
    console.log(`Completed scan with ${updatecount} new updates.`);
}

async function embedPost(creator, creatorId, post) {
    const embed = new EmbedBuilder()
        .setAuthor( { 
            name: creator.name, 
            iconURL: `https://img.${creator.website}.su/icons/${creator.service}/${creatorId}`, 
            url: `https://${creator.website}.su/${creator.service}/user/${creatorId}`} )
        .setTitle(post.title)
        .setURL(`https://${creator.website}.su/${creator.service}/user/${creatorId}/post/${post.id}`)
        .setImage(`https://www.${creator.website}.su/data${post.file['path']}`)
        .setThumbnail(`https://img.${creator.website}.su/icons/${creator.service}/${creatorId}`)
        //.setTimestamp(true)
        //.setFooter(post.added)

    if (turndownService.turndown(post.content).length) {
        try {
            embed.setDescription(turndownService.turndown(post.content));
        } catch (error) {
            embed.setDescription("ERROR: Description is too long.")
        }
        
    }
    if (post.tags !== null) {
        embed.addFields({ name: 'Tags', value: post.tags });
    }
    if (creator.subscribers.length) {
        const mentions = creator.subscribers.map(subscriber => `<@${subscriber}>`);
        const mentionString = mentions.join(', ');
        embed.setFields({ name: 'Notifications', value: mentionString });
    }
    return embed;
}

module.exports = {
    updateLocal, updateFeeds
}
