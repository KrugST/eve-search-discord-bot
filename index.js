import { Client, GatewayIntentBits } from 'discord.js';
import { refreshCommands } from './slash-commands';
import { config } from './src/config/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    switch (interaction.commandName) {
        case "search-by-eve-name":
            await interaction.deferReply();
            const name = interaction.options.getString('name');
            if (!name) {
                await interaction.editReply('Please provide a name!');
                return;
            }
            const embedMessage = await trackMemberByName(name);
            await interaction.editReply({ embeds: [embedMessage] });
            break;
        case "search-by-discord-user":
            await interaction.deferReply();
            const user = interaction.options.getMember('user');
            if (!user) {
                await interaction.editReply('User not found!');
                return;
            }
            // @ts-ignore
            const embedMessageUser = await trackMemberByName(user.nickname);
            await interaction.editReply({ embeds: [embedMessageUser] });
            break;
    }
});

refreshCommands().then(() => {
    client.login(config.DISCORD_TOKEN);
});
