import { REST, Routes } from 'discord.js';
import { config } from './src/config/config';

const commands = [
    {
        name: 'search-by-discord-user',
        description: 'Get information about EVE online character by discord user',
        options: [{
            "name": "user",
            "description": "Please tag the discord user you want to find",
            "type": 6, // 6 is type USER
            "required": true
        }]
    },
    {
        name: 'search-by-eve-name',
        description: 'Get information about EVE online character by name',
        options: [{
            "name": "name",
            "description": "Please enter the name of the character you want to find",
            "type": 3, // 3 is type USER
            "required": true,
            "min_length": 1,
            "max_length": 100
        }]
    },
];

const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

async function refreshCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

export { refreshCommands };