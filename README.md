## About
This is a discord bot that retrieves updates from creators on [kemono.part](https://kemono.su) and [coomer.party](https://coomer.su). Updates will be sent to a discord server where the creator was added or to a dm if you add a creator in a direct message with the bot.

## Discord Commands
- **`/add`** {name} || {url}
   <dl>Add a creator to the current channel.</dl>
- **`/del`** {name} || all
   <dl>Delete a creator from the current channel. Delete all creators with `/del all`</dl>
- **`/sub`** {name}
   <dd>Subscribe to a creator in the channel. You will be mentioned when a creator you've subscribed to posts.</dl>
- **`/unsub`** {name}
   <dl>Unsubscribe from a creator in the channel.</dl>
- **`/list`** 
   <dl>List all creators in the current channel along with some additional information.</dl>
- **`/version`**
   <dl>Displays the current version of KemonoBot.</dl>
### Future Commands
- **`/info`** {name}
   <dl>Get more information on a specific creator than what /list provides.</dl>
- **`/export`** {channel} || {server}, {bool include settings}
   <dl>Generate a json file containing all of the creators (with optional settings) for the current channel/server.</dl>
- **`/import`** {.json file attachment}
   <dl>Import a generated json file of creators and settings to be added into the current channel/server</dl>
- **`/filter`** {name} || all, {add} || {del} || {list}, {keyword(s) to exclude}, {title} || {description} || {summary?} || {tags}
   <dl>Add/remove/list filters to/from exclude posts.</dl>
- **`/stats`** {bool adv}
   <dl>Display current stats with optional advanced stats</dl>

## Self Hosting Guide
1. **Clone the repository.**

   Open a terminal in the directory you want to clone the repository to and run 
   ```
   git clone https://github.com/AeoviiDark/KemonoBot.git
   ```

2. **Install node.**

   In your terminal, run 
   ```
   npm install node
   ```

3. **Install dependencies**

   uh, Ill get this later.

4. **Create a bot on Discord's Developer Portal.**

   later

5. **Change your config.json.**

   You will have a config-example.json in your KemonoBot directory. Create a duplicate and/or open the original with a text editor and enter the following information:
   - `token`: With your new bot selected from the applications, under Bot, click the Reset Token button to generate a new token. Copy it down and save it. Discord only lets you access it once. If you lose this token, you will have to reset the token again to gain another.
   - `clientId`: To get your bot's client id, you will have to enable developer mode on your discord client. Click User Settings, Advanced, and enable Developer Mode. Go back, right click the bot in the members list then Copy User ID at the bottom of the list. 
   - `guildId`:  With developer mode enabled, right click your server's name in the top right and Copy Server ID. Set this if you want your bot's commands to be registerd only on this specific server. If instead you want the commands to be registered globally, leave this value blank.
   - `interval`: This is how often you want the bot to check for updates. The default is 10 minutes and should accomodate most use cases. Anything lower isn't really necessary but if you need faster updates, the option is there at the cost of more internet bandwidth and compute power. Anything lower than 1 minute is not advised. Do be warned that the time it takes to search for updates is proportional to the amount of added creators, so set the interval accordingly. 
   Once you have your information filled out, save the json file and rename it to `config.js`.

6. **Register the commands.**

   In the KemonoBot repository directory, run 
   ```
   node deploy-commands.js
   ```
   If you set guildId in config.json, the commands will only be registered to the server with that Id, otherwise the commands will be registered globally.

7. **Launch it!**

   To start the bot, run
   ```
   node index.js
   ``` 

## Why is my code so bad?

   Only a week ago I had no idea how to code in javascript. However, I'm somewhat compotent in some other languages so I kind of know what I'm doing half the time. I know my code is ugly, inefficient, and probably has some exploit that I'm too inexperienced to spot. If you do see an improvement or fix to something, let me know and I'll do my best to address it. How you contact me? Uhh... maybe find me on discord? idk if github has a msging thing or if you can request to change code on a repository. tbh this is my first project like on this on github so I've no idea what I'm doing. 

## Known issues. (AKA fix later list)
- Unknown embedding bug when setting description
- Writing while checking for updates does not successfully write
- Autocomplete for /del, /sub, and /unsub doesn't work in dms
- Sub/unsub doesnt work in dms

## Probably something else that I'm forgetting.

   Oh well, Ill add it when I think of it.