// Load environment variables from .env file (if used)
require("dotenv").config();

// Import necessary Discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");

const fs = require('fs');
const path = require('path');

// Load the bot token from config.json
const token = require("./config/config.json").token;

// Create a new Discord client instance with the required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           // Allows the bot to receive events related to guilds (servers)
        GatewayIntentBits.GuildMessages,    // Allows reading messages sent in guild text channels
        GatewayIntentBits.MessageContent,   // Enables the bot to read message content (required for commands)
    ],
});

client.commands = new Collection();

const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Event Listener: Handle slash (/) commands
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command found for ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "There was an error executing this command!", ephemeral: true });
    }
});

// Log the bot into Discord using the provided token
client.login(token).then(() => {
    console.log("Bot successfully logged in and ready!");
}).catch((error) => {
    console.error("Failed to log in. Check your token and config.json:", error);
});
