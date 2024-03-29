const fs = require('fs').promises;

async function read(filePath = './data/data.json') {
    try {
        await fs.access(filePath);
    } catch (error) {await fs.writeFile(filePath, '{}')}
    try {
        const data = await fs.readFile(filePath);
        return JSON.parse(data);
    } catch (error) {throw error;}


    
}

async function write(data, filePath = './data/data.json') {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {throw error;}
}

async function addCreator(interaction, creator) {
    let data = await read();
    if (!data.hasOwnProperty(interaction.guildId)) data[interaction.guildId] = {};
    if (!data[interaction.guildId].hasOwnProperty(interaction.channelId)) data[interaction.guildId][interaction.channelId] = {};
    if (!data[interaction.guildId][interaction.channelId].hasOwnProperty(creator.id)) {

        const url = `https://${creator.website}.party/api/v1/${creator.service}/user/${creator.id}`
        let newPosts
        try {
            newPosts = await (await fetch(url)).json();
        } catch (error) {
            console.log(`Error fetching from ${url}: ${error}`)
            return
        }
        const posts = [];
        for (let newPost of newPosts) {
            posts.push(newPost.id)
        }

        data[interaction.guildId][interaction.channelId][creator.id] = { 
            id: creator.id,
            name: creator.name ,
            service: creator.service,
            website: creator.website,
            subscribers: [],
            embedoptions: {},
            posts: posts
        };
    } else {
        return "This creator already exists."
    }
    
    await write(data);
    return `Added ${creator.name}'s ${creator.service} to <#${interaction.channelId}>`
}

async function delCreator(interaction, creator) {
    let data = await read();
    if (Object.keys(data).length === 0) { return `There are no creators in this server.`; }
    if (Object.keys(data[interaction.guildId]).length === 0) { return `There are no creators in this server.`; }
    if (Object.keys(data[interaction.guildId][interaction.channelId]).length === 0) { return `There are no creators in <#${interaction.channelId}>.`; }
    if (creator === undefined) {
        delete data[interaction.guildId][interaction.channelId];
        trimData(data, interaction);
        await write(data);
        return `Deleted all creators from <#${interaction.channelId}>.`
    } else {
        delete data[interaction.guildId][interaction.channelId][creator.id];
        await trimData(data, interaction);
        await write(data);   
        return `Deleted ${creator.name}'s ${creator.service} from <#${interaction.channelId}>.`
    }
}

async function listCreators(interaction) {
    const data = await read();
    if (data[interaction.guildId] === undefined) { return []; }
    if (data[interaction.guildId][interaction.channelId] === undefined) { return []; }
    const list = Object.values(data[interaction.guildId][interaction.channelId])
    return list;
}   

async function trimData(data, interaction) {
    if (Object.keys(data[interaction.guildId][interaction.channelId]).length === 0) {
        delete data[interaction.guildId][interaction.channelId];
        if (Object.keys(data[interaction.guildId]).length === 0) {
            delete data[interaction.guildId];
        } 
    }
}

async function addSub(interaction, creator) {
    const data = await read();
    if (data[interaction.guildId] === undefined) {return "There are no creators in this server.";}
    if (data[interaction.guildId][interaction.channelId] === undefined) {return `There are no creators in <#${interaction.channelId}>.`;}
    if (data[interaction.guildId][interaction.channelId][creator.id] === undefined) {return `${creator.name}'s ${creator.service} is not in <#${interaction.channelId}>.`;}
    if (data[interaction.guildId][interaction.channelId][creator.id].subscribers.includes(interaction.member.id)) {return `You've already subscribed to ${creator.name}'s ${creator.service}.`}
    data[interaction.guildId][interaction.channelId][creator.id].subscribers.push(interaction.member.id);
    await write(data);
    return `You are now subscribed to ${creator.name}'s ${creator.service}.`;
}

async function delSub(interaction, creator) {
    const data = await read();
    if (data[interaction.guildId] === undefined) {return "There are no creators in this server.";}
    if (data[interaction.guildId][interaction.channelId] === undefined) {return `There are no creators in <#${interaction.channelId}>.`;}
    if (data[interaction.guildId][interaction.channelId][creator.id] === undefined) {return `${creator.name}'s ${creator.service} is not in <#${interaction.channelId}>.`;}
    if (!data[interaction.guildId][interaction.channelId][creator.id].subscribers.includes(interaction.member.id)) {return `You are not subscribed to ${creator.name}'s ${creator.service}.`}
    data[interaction.guildId][interaction.channelId][creator.id].subscribers = data[interaction.guildId][interaction.channelId][creator.id].subscribers.filter(subscriber => subscriber !== interaction.member.id);
    await write(data);
    return `You've unsubscribed from ${creator.name}'s ${creator.service}.`;
}

module.exports = {
    read, write, addCreator, delCreator, listCreators, addSub, delSub
}