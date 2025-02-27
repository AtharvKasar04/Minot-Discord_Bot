require("dotenv").config();
const { Client, Events, GatewayIntentBits, MessageActivityType } = require("discord.js");
const token = require("./config/config.json").token;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("messageCreate", (message) => {
    if(message.author.bot) return;

    if (message.content.toLowerCase() === 'hi minot'){
        message.reply("Hi from Minot :)");
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong!');
    }
  });

client.login(token);