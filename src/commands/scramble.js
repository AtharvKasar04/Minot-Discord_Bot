const { SlashCommandBuilder } = require('discord.js');

// Dictionary of words categorized by length
const words = require('../words');

/**
 * Function to scramble a word by shuffling its characters randomly.
 * @param {string} word - The original word to scramble.
 * @returns {string} - The scrambled word.
 */

// The @Param is just a simple documentation for function parameters

function scrambleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

module.exports = {
    // Slash command definition
    data: new SlashCommandBuilder()
        .setName('scramble')
        .setDescription('Play a scramble words game!')
        .addIntegerOption(option =>
            option.setName('difficulty')
                .setDescription('Select word length')
                .setRequired(true)
                .addChoices(
                    { name: '4 letters', value: 4 },
                    { name: '5 letters', value: 5 },
                    { name: '6 letters', value: 6 },
                    { name: '7 letters', value: 7 },
                    { name: '8 letters', value: 8 },
                    { name: '9 letters', value: 9 },
                    { name: '10 letters', value: 10 },
                )),

    async execute(interaction) {
        // Get the word length selected by the user
        const wordLength = interaction.options.getInteger('difficulty');

        // Retrieve a list of words of the chosen length
        const wordList = words[wordLength];

        // If the length is invalid (should never happen with correct choices), return an error
        if (!wordList) {
            return interaction.reply("❌ Invalid selection. Please pick a valid difficulty.");
        }

        // Select a random word from the chosen word list
        const originalWord = wordList[Math.floor(Math.random() * wordList.length)];
        
        // Scramble the selected word
        const scrambled = scrambleWord(originalWord);

        // Send the scrambled word as a challenge to the user
        await interaction.reply(`**Unscramble this word:** \`${scrambled}\`\n⏳ You have **20 seconds**! Reply with your guess.`);

        // Define a filter to collect messages only from the user who initiated the command
        const filter = response => response.author.id === interaction.user.id;

        // Start a message collector to listen for the user's response within 20 seconds
        const collector = interaction.channel.createMessageCollector({ filter, time: 20000, max: 1 });

        // Event handler for when a message is collected (i.e., the user attempts to guess)
        collector.on('collect', msg => {
            if (msg.content.toLowerCase() === originalWord) {
                // If the guess is correct, reply with a success message
                msg.reply("✅ Correct! 🎉");
            } else {
                // If the guess is incorrect, reveal the correct word
                msg.reply(`❌ Wrong! The correct word was **${originalWord}**.`);
            }
            collector.stop(); // Stop the collector as the user has made their attempt
        });

        // Event handler for when the timer ends and no message is collected
        collector.on('end', collected => {
            if (collected.size === 0) {
                // If the user didn't reply in time, reveal the correct answer
                interaction.followUp(`⏳ Time's up! The correct word was **${originalWord}**.`);
            }
        });
    },
};
