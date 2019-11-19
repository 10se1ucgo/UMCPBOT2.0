require('dotenv').config()

const fs = require('fs');
const Discord = require('discord.js');
const { Pool } = require('pg');

const messages = require('./messages.js')
const config = require('./config/config.json')

// Initialize client
const client = new Discord.Client();

// Initialize db
const db = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING
});
db.connect();


// Read commands from command directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Setup cooldowns
client.cooldowns = new Discord.Collection();

// Wait for client to be ready
client.once('ready', () => {
  console.log('Ready!');
});

// Handle messages
client.on('message', message => messages(client, db, message));

client.login(process.env.DISCORD_TOKEN);
