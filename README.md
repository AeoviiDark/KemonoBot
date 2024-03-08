## About
This is a Discord bot that retrieves updates from creators on [kemono.party](https://kemono.su) and [coomer.party](https://coomer.su). Updates will be sent to a discord server where the creator was added or to a dm if you add a creator in a direct message with the bot.

## NOTICE
KemonoBot will not be recieving any more updates. I enjoyed working on this project and it taught me a lot about APIs, javascript, and designing/storing data in json object structures. Thank you for helping me test what little there was to test lmao.

I'm retiring KemonoBot because I will no longer be using it myself. I've found a better method that achieves exactly what I had envisioned for KemonoBot and more. If anyone would still like me to continue developing KemonoBot, I'll finish the API rewrite and continue to update it albeit even more slowly. Sry.

I am now using a locally hosted RSS server from RSSHub which adapts many websites that dont have RSS available and generates one. The contributers at RSSHub have done this for thousands of sites, Kemono/Coomer.party included. Now that I have an actual RSS feed and not just an imitation of one in a discord channel in the form of a discord bot running on barely stable code, I see no reason to continue to personally use KemonoBot when a much better alternative is available. 

Thank you so much to those that helped me out with this stupid little project of mine. <3

## Disclaimer
Promoting pirated content (such as the content available on kemono.party and coomer.party) through Discord is against Discord TOS. Use this bot at your own discretion. I am not liable for any repercussions you may encounter.

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
- **`/changelog`**
   <dl>Displays the changes made in each version of KemonoBot.</dl>
- **`/help`**
   <dl>Show a list of commands and their usage. (You're here!)</dl>
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

2. **Install Node.**

   Download nodejs from [nodejs.org](https://nodejs.org/en/download) and install it. You can confirm your installation with `node -v`.

   If you need any help with steps 2-5, [discordjs.guide](https://discordjs.guide/preparations/#installing-node-js) probably explains all of this better under "Installations & Preparations."

3. **Install Discordjs**

   In your terminal, run
   ```
   npm install discord.js
   ```

4. **Create a bot on Discord's developer portal.**

   Go to [Discord's developer portal](https://discord.com/developers/applications) and log into your account. Click on the "New Application" button, enter a name for the application, and confirm the creation. In the "Bot" tab, enter a username for the bot and set the visibility to public or private. Click "Reset Token" and copy this to a secure location. Discord only lets you access this once. If you lose this token, you will have to reset the token to gain another, invalidating the old token. 

5. **Invite your bot to your server.**
   
   In [Discord's developer portal](https://discord.com/developers/applications) and under your newly created application, click on the "OAuth2" tab. In the sidebar under the tab, click "OAuth2 URL generator." Select the `bot` and `applications.commands` scopes. Enable `Read Messages/View Channels`, `Send Messages`, `Embed Links`, and `Attach Files` permissions.
   
   Alternatively, you can manually construct an invite link by pasting your bot's client id into this url, replacing the three underscores: `https://discord.com/api/oauth2/authorize?client_id=___&permissions=52224&scope=applications.commands+bot`. (Your client id can be found under OAuth2/General) 
   
   Finally, open the url and choose the server you would like to add the bot to.
   

6. **Change your config.json.**

   You will have a config-example.json in your KemonoBot directory. Create a duplicate and/or open the original with a text editor and enter the following information:
   - `token`: This is the token you should have saved in step 4.
   - `clientId`: To get your bot's client id, you will have to enable developer mode on your Discord client. Click User Settings, Advanced, and enable Developer Mode. Go back, right click the bot in the members list then Copy User ID at the bottom of the list. Alternatively, your client id can be found under OAuth2/General in [Discord's developer portal](https://discord.com/developers/applications).
   - `guildId`:  With developer mode enabled, right click your server's name in the top right and Copy Server ID. Set this if you want your bot's commands to be registerd only on this specific server. If instead you want the commands to be registered globally on any server your bot is in, leave this value blank.
   - `interval`: This is how often you want the bot to check for updates. The default is 10 minutes and should accomodate most use cases. Anything lower isn't really necessary but if you need faster updates, the option is there at the cost of more internet bandwidth and compute power. Anything lower than 1 minute is not advised. Do be warned that the time it takes to search for updates is proportional to the amount of added creators, so set the interval accordingly. 
   Once you have your information filled out, save the json file and rename it to `config.json`.

7. **Register the commands.**

   (This might happen automatically on first startup in the future.)

   In the KemonoBot repository directory, run 
   ```
   node deploy-commands.js
   ```
   If you set a guildId in config.json, the commands will only be registered to the server with that Id, otherwise the commands will be registered globally.

8. **Launch it!**

   To start the bot, run
   ```
   node index.js
   ``` 

## Why is my code so bad?

   Only a week ago I had no idea how to code in javascript. However, I'm somewhat compotent in some other languages so I kind of know what I'm doing half the time. I know my code is ugly, inefficient, and probably has some exploit that I'm too inexperienced to spot. If you do see an improvement or fix to something, create a new issue or let me know and I'll do my best to resolve it. How you contact me? Uhh... maybe find me on discord? idk if github has a msging thing or if you can request to change code on a repository. tbh this is my first project like on this on github so I've no idea what I'm doing. 

## Known issues. (AKA fix later list)
- Unknown embedding bug when setting description
- Writing while checking for updates does not successfully write
- Autocomplete for /del, /sub, and /unsub doesn't work in dms
- Sub/unsub doesnt work in dms

## Probably something else that I'm forgetting.

   Oh well, Ill add it when I think of it.