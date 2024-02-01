const { EmbedBuilder } = require('discord.js');
const turndown = require('turndown');

const fs = require('fs').promises;
const { read, write } = require('./dbms.js')

async function updateLocal() {
    process.stdout.write(`Updating local... `);
    const startTime = performance.now();
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
    const endTime = performance.now();
    process.stdout.write('\r\x1b[K');
    console.log(`Updated local in ${((endTime-startTime)/1000).toFixed(2)} seconds.`)
}

async function updateFeeds(client) {

    const data = await read();
    let updatecount = 0;
    if (!updateFeeds.counter) updateFeeds.counter = 0;
    const fetchPromises = [];

    process.stdout.write(`${conTS()} Starting retrieval cycle ${updateFeeds.counter}...`);
    let startTime = performance.now();

    for (const serverId of Object.keys(data)) {
        for (const channelId of Object.keys(data[serverId])) {
            for (const creatorId of Object.keys(data[serverId][channelId])) {
                const creator = data[serverId][channelId][creatorId];
                fetchPromises.push(fetchData(`https://${creator.website}.party/api/v1/${creator.service}/user/${creatorId}`));
            }
        }
    }

    Promise.all(fetchPromises)
        .then(async (responses) => {
            await write(data);
            let endTime = performance.now();
            const fetchTime = ((endTime-startTime)/1000).toFixed(2);
            process.stdout.write(`${conLC()}${conTS()} Finished retrieval cycle ${updateFeeds.counter} in ${fetchTime} seconds. `);
            if (!responses.length) return;
            startTime = performance.now();
            process.stdout.write('Dispatching posts...');

            for (const serverId of Object.keys(data)) {
                for (const channelId of Object.keys(data[serverId])) {
                    let channel = await client.channels.fetch(channelId);
                    for (const creatorId of Object.keys(data[serverId][channelId])) {
                        const creator = data[serverId][channelId][creatorId];
                        const posts = responses.shift();
                        const newPosts = posts.filter(post => !creator.posts.includes(post.id));
                        for (let newPost of newPosts) {
                            updatecount += 1;
                            creator.posts.push(newPost.id);
                            const msg = await embedPost(channel, creator, newPost);
                            await replyMsg(msg, creator, newPost);                   
                        }
                    }
                }
            }
            await write(data);
            endTime = performance.now();
            const postTime = ((endTime-startTime)/1000).toFixed(2);
            
            process.stdout.write(`${conLC()}${conTS()} Finished retrieval cycle ${updateFeeds.counter} in ${fetchTime} seconds. Finished dispatching ${updatecount} posts in ${postTime} seconds.\n`);
            ++updateFeeds.counter
        })
}

async function fetchData(url){
    try {
        return await (await fetch(url)).json();
    } catch (error) {
        process.stdout.write(`ERROR: Failed api fetch from ${url}:\n ${error}\n`);
    }
    
}

async function embedPost(channel, creator, post) {
    const embed = new EmbedBuilder()
        .setAuthor( { 
            name: creator.name, 
            iconURL: `https://img.${creator.website}.su/icons/${creator.service}/${creator.id}`, 
            url: `https://${creator.website}.su/${creator.service}/user/${creator.id}`} )
        .setTitle(post.title)
        .setURL(`https://${creator.website}.su/${creator.service}/user/${creator.id}/post/${post.id}`)
        .setImage(`https://www.${creator.website}.su/data${post.file['path']}`)
        .setThumbnail(`https://img.${creator.website}.su/icons/${creator.service}/${creator.id}`)
        .setTimestamp(new Date(post.published).getTime());

    const content = (await htmlToMarkdown(post.content)).shift();
    if (content === undefined) {
        embed.setDescription('No Description.');
    } else {
        try {
            embed.setDescription(content);
        } catch (error) {
            embed.setDescription(`There was an error embedding this description. View the original post here: https://${creator.website}.su/${creator.service}/user/${creator.id}/post/${post.id}`);
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
    const msg = await channel.send({ embeds: [embed] });
    return msg;
}

async function replyMsg(prevmsg, creator, post) {
    const mdArray = (await htmlToMarkdown(post.content)).slice(1);
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

function conTS() {return `\x1b[34m[${new Date().toTimeString().split(' ')[0]}]\x1b[0m`}
function conLC() {return '\r\x1b[K'}

module.exports = {
    updateLocal, updateFeeds, fetchData, embedPost
}
