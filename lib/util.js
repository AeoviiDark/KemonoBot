const { read } = require('./dbms.js')

async function lookupId(id) {
    let data = await read("./data/creators-kemono.json");
    if (!data.hasOwnProperty(id)) {data = await read("./data/creators-coomer.json");}
    if (!data.hasOwnProperty(id)) { return }
    return data[id]
}   

async function lookupName(name) {
    let data = await read("./data/creators-kemono.json");
    let creator = data.find(obj => obj.name === name);
    if (creator !== undefined) { 
        return {
            id: creator.id,
            name: creator.name,
            service: creator.service,
            website: 'kemono'
        } 
    }
    data = await read("./data/creators-coomer.json");
    creator = data.find(obj => obj.name === name);
    if (creator !== undefined) { 
        return {
            id: creator.id,
            name: creator.name,
            service: creator.service,
            website: 'coomer'
        } 
    }
    return
}

module.exports = {
    lookupId, lookupName
}