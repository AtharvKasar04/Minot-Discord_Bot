require("dotenv").config(); // Load environment variables
const { REST, Routes } = require("discord.js");
const TOKEN = require("./config/config.json").token;
const CLIENT_ID = require("./config/config.json").CLIENT_ID;

console.log(`CLIENT_ID: ${process.env.CLIENT_ID}`);
console.log(`TOKEN: ${TOKEN}`);

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    // if (!CLIENT_ID) {
    //     console.error("Error: CLIENT_ID is undefined. Check your .env file.");
    //     process.exit(1);
    //   }

    await rest.put(Routes.applicationCommands("1344537701642272838"), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
