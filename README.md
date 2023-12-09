# About
This is a discord bot that 

## Discord Commands
- **/add** Ill get more info on these later.
- **/del**
- **/sub**
- **/unsub**
- **/list**
- **/version**

## Installation Guide
1. **Clone the repository.**
   Open a terminal in the directory you want to clone the repository to and run `git clone <url>`.
2. **Install node.**
3. **Install dependencies**
   uh, Ill get this later.
4. **Create a bot on Discord's Developer Portal.**
   later
5. **Change your config.json.**
   You will have a config-example.json in your KemonoBot directory. Create a duplicate and/or open the original with a text editor and enter the following information:
   - **token**: With your new bot selected from the applications, under Bot, click the Reset Token button to generate a new token. Copy it down and save it. Discord only lets you access it once. If you lose this token, you will have to reset the token again to gain another.
   - **clientId**: To get your bot's client id, you will have to enable developer mode on your discord client. Click User Settings, Advanced, and enable Developer Mode. Go back, right click the bot in the members list then Copy User ID at the bottom of the list. 
   - **guildId**:  With developer mode enabled, right click your server's name in the top right and Copy Server ID. Set this if you want your bot's commands to be registerd only on this specific server. If instead you want the commands to be registered globally, leave this value blank.
   - **interval**: This is how often you want the bot to check for updates. The default is 10 minutes and should accomodate most use cases. Anything lower isn't really necessary but if you need faster updates, the option is there at the cost of more internet bandwidth and compute power. Anything lower than 1 minute is not advised. Do be warned that the time it takes to search for updates is proportional to the amount of added creators, so set the interval accordingly. 
   Once you have your information filled out, save the json file and rename it to `config.js`.
6. **Register the commands.**
   - In the KemonoBot repository directory, run `node deploy-commands.js`. If you set guildId in config.json, the commands will only be registered to the server with that Id, otherwise the commands will be registered globally.
7. **Launch it!**
   - Run `node index.js` to start the bot.

## Probably something else that I'm forgetting.