const dotenv = require('dotenv').config();
const commandList = require('./commandList/index.js')
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const TOKEN = process.env.TOKEN || TestToken;
const prefix = '-';


const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});

client.commands = new Collection();

// Checks every file in commands file and set it's name as the command key
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log('GroovyRhythm is online!');
});

// Responds to commands after ridding the prefix
client.on('messageCreate', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  if(commandList[command]){
    client.commands.get(command).execute(message, args);

  }
  // if (command === 'ping') {
  // } else if (command === 'play') {
  //   client.commands.get(command).execute(message, args);
  // }
});

//Logins with token
client.login(TOKEN);
