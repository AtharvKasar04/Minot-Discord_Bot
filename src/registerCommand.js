const path = require("path");

// Load environment variables from .env file (if available)
require("dotenv").config({ path: path.join(__dirname, '..', '.env') });

// Import required modules from discord.js
const { REST, Routes } = require("discord.js");

const fs = require("fs");

// Load bot credentials from config.json
const TOKEN = require("./config/config.json").token;
// const CLIENT_ID = require("./config/config.json").CLIENT_ID; // Application (bot) ID

// Get CLIENT_ID from environment variables
const CLIENT_ID = process.env.CLIENT_ID;

// Check if CLIENT_ID is defined
if (!CLIENT_ID) {
    console.error("CLIENT_ID is not defined in your .env file. Please add it.");
    process.exit(1);
}

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
            Routes.applicationCommands(CLIENT_ID), // Use the CLIENT_ID variable directly
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error("Error while registering commands:", error);
    }
})();
