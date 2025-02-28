const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong! and shows latency info."),
    async execute(interaction) {
        // Send an initial reply and fetch the sent message to calculate latency.
        const sent = await interaction.reply({ content: "Pong!", fetchReply: true });

        // Calculate round-trip latency:
        // The difference between when the reply was created and when the interaction was created.
        const latency = sent.createdTimestamp - interaction.createdTimestamp;

        // Get the WebSocket ping from the Discord client.
        const wsPing = interaction.client.ws.ping;

        // Edit the original reply to include the latency information.
        await interaction.editReply(`Pong! Round-trip latency: ${latency}ms. API heartbeat: ${wsPing}ms.`);
    },
};
