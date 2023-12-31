const { EmbedBuilder } = require('discord.js');
const turndown = require('turndown');

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
                let posts
                try {
                    posts = await (await fetch(url)).json();
                } catch (error) {
                    console.log(`Error fetching from ${url}: ${error}`)
                    return
                }
                
                const newPosts = posts.filter(post => !creator.posts.includes(post.id))
                for (let newPost of newPosts) {
                    updatecount += 1;
                    creator.posts.push(newPost.id);
                    const mdArray = await htmlToMarkdown(newPost.content)
                    const msg = await embedPost(channel, creator, newPost, (await mdArray).shift());
                    await replyMsg(msg, creator, newPost, mdArray);                   
                }
            }
        }
    }
    await write(data);
    console.log(`Completed scan with ${updatecount} new updates.`);
}

async function embedPost(channel, creator, post, content) {
    const embed = new EmbedBuilder()
        .setAuthor( { 
            name: creator.name, 
            iconURL: `https://img.${creator.website}.su/icons/${creator.service}/${creator.id}`, 
            url: `https://${creator.website}.su/${creator.service}/user/${creator.id}`} )
        .setTitle(post.title)
        .setURL(`https://${creator.website}.su/${creator.service}/user/${creator.id}/post/${post.id}`)
        .setImage(`https://www.${creator.website}.su/data${post.file['path']}`)
        .setThumbnail(`https://img.${creator.website}.su/icons/${creator.service}/${creator.id}`)
        
    
    try {
        embed.setDescription(content);
    } catch (error) {
        embed.setDescription(`There was an error embedding this description. Not sure why. If you still want to see it, here's the link: https://${creator.website}.su/${creator.service}/user/${creator.id}/post/${post.id}`)
    }

    if (post.tags !== null) {
        embed.addFields({ name: 'Tags', value: post.tags });
    }
    if (creator.subscribers.length) {
        const mentions = creator.subscribers.map(subscriber => `<@${subscriber}>`);
        const mentionString = mentions.join(', ');
        embed.setFields({ name: 'Notifications', value: mentionString });
    }
    const msg = await channel.send({ embeds: [embed] });
    return msg;
}

async function replyMsg(prevmsg, creator, post, mdArray) {
    for (const content of mdArray) {
        const embed = new EmbedBuilder()
            .setAuthor( { 
                name: creator.name, 
                iconURL: `https://img.${creator.website}.su/icons/${creator.service}/${creator.id}`, 
                url: `https://${creator.website}.su/${creator.service}/user/${creator.id}`} )
            .setTitle(`Continuation of: ${post.title}`)
            .setURL(`https://${creator.website}.su/${creator.service}/user/${creator.id}/post/${post.id}`)
            .setImage(`https://www.${creator.website}.su/data${post.file['path']}`)
            .setThumbnail(`https://img.${creator.website}.su/icons/${creator.service}/${creator.id}`)
            .setDescription(content)
        prevmsg = await prevmsg.reply({ embeds: [embed] });
    }  
}

async function htmlToMarkdown(htmlData) {
    const chunkSize = 4096;
    htmlChunks = [];
    for (let i = 0; i < htmlData.length; i += chunkSize) {
        htmlChunks.push(htmlData.slice(i, i + chunkSize));
    }
    const td = new turndown();
    let markdownArray = []
    for (const chunk of htmlChunks) {
        const mdChunk = await td.turndown(chunk);
        markdownArray.push(mdChunk)
    }
    return markdownArray
}

module.exports = {
    updateLocal, updateFeeds
}
