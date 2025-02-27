// Load environment variables from .env file (if available)

// Import required modules from discord.js
const { REST, Routes } = require("discord.js");

const fs = require("fs");

const path = require("path");

require("dotenv").config();

// Load bot credentials from config.json
const TOKEN = require("./config/config.json").token;
// const CLIENT_ID = require("./config/config.json").CLIENT_ID; // Application (bot) ID

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON()); // Convert command to JSON format
}


// Create a new REST client for interacting with Discord API
const rest = new REST({ version: '10' }).setToken(TOKEN);

// Immediately Invoked Async Function Expression (IIFE) to register the commands
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        // Register the slash commands globally (visible in all servers where the bot is added)
        await rest.put(
            Routes.applicationCommands("1344537701642272838"), // Replace with CLIENT_ID if needed
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error("Error while registering commands:", error);
    }
})();
