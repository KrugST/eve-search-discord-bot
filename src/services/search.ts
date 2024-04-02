import { getAllCharacterInfo, searchEveUsers } from '../eve-api/character';
import { getCorporationInfo } from '../eve-api/corporations';
import { callApiWithTokenRefresh } from '../eve-api/authorization';
import { EmbedBuilder } from 'discord.js';
import { config } from '../config/config';

const getPublicEveDataForUser = async (searchTerm: string) => {
    console.log('getPublicEveDataForUser: searchTerm: ', searchTerm); 
    const searchResults = await callApiWithTokenRefresh({
        apiFunction: searchEveUsers,
        autorizationObject: { access_token: config.ACCESS_TOKEN, refresh_token: config.REFRESH_TOKEN, expires_in: 1200, token_type: 'Bearer' },
        args: [config.ACCESS_TOKEN, config.EVE_ESI_CHARACTER_ID, searchTerm]
    });

    if (searchResults && searchResults?.character) {
        const characterId = searchResults?.character[0];
        if (!characterId) {
            console.log('getPublicEveDataForUser: Character not found: ', searchTerm);
            const embed = await new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(searchTerm)
                .setDescription('Character not found. Please try again.')
                .setTimestamp();
            return embed;
        }
        console.log('getPublicEveDataForUser: Character found: ', characterId);
        const characterInformation = await getAllCharacterInfo(characterId);

        const corporation = characterInformation.corporationInfo;
        const corporationUrl = `https://evewho.com/corporation/${corporation.corporation_id}`;

        const corporationhistory = characterInformation.characterCorporationHistory;

        const alliance = characterInformation.allianceInfo;
        const allianceUrl = `https://evewho.com/alliance/${alliance.alliance_id}`;

        const characterImage = characterInformation.characterPortrait.px256x256;
        const allianceImage = characterInformation.allianceImage.px64x64;
        const corporationImage = characterInformation.corporationImage.px128x128;


        const embed = await new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setAuthor({ name: `${alliance.name}`, iconURL: allianceImage })
            .setTitle(characterInformation.name)
            .setURL(`https://evewho.com/character/${characterId}`)
            .setThumbnail(corporationImage)
            .setImage(characterImage)
            .addFields(
                { name: 'Birthday', value: `${characterInformation.birthday}` },
                { name: 'Security Status', value: `${characterInformation.security_status}` },
                { name: 'Corporation', value: `[${corporation.name}](${corporationUrl})` },
                { name: 'Alliance', value: `[${alliance.name}](${allianceUrl})` },
                { name: '\u200B', value: `\u200B` },
                { name: 'Previous Corporation', value: `Joined corporation on:` },
            )
            .setTimestamp();

        if (Object.keys(corporationhistory).length > 0) {
            for (const corporation of corporationhistory.slice(0, 15)) {
                const corporationInfo = await getCorporationInfo(corporation.corporation_id);
                const joinedDate = new Date(corporation.start_date).toLocaleDateString();
                embed.addFields(
                    { name: `${joinedDate}`, value: `[${corporationInfo.name}](https://evewho.com/corporation/${corporation.corporation_id})` }
                );
            }
        }
        console.log('getPublicEveDataForUser: Search success: ', characterId);
        return embed;
    } else {
        console.log('getPublicEveDataForUser.else: Character not found: ', searchTerm);
        const embed = await new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(searchTerm)
            .setDescription('Character not found. Please try again.')
            .setTimestamp();
        return embed;
    }

};

export { getPublicEveDataForUser };