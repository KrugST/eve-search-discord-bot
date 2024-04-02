import { getAllCharacterInfo, searchEveUsers } from '../eve-api/character';
import { getCorporationInfo, getCorporationImage } from '../eve-api/corporations';
import { callApiWithTokenRefresh } from '../eve-api/authorization';
const { EmbedBuilder } = require('discord-embed-builder');
import { config } from '../config/config';

const getPublicEveDataForUser = async (searchTerm: string) => {
    const searchResults = await callApiWithTokenRefresh({
        apiFunction: searchEveUsers,
        autorizationObject: { access_token: config.ACCESS_TOKEN, refresh_token: config.REFRESH_TOKEN, expires_in: 1200, token_type: 'Bearer' },
        args: [config.ACCESS_TOKEN, searchTerm]
    });

    if (searchResults && searchResults?.character) {
        const characterId = searchResults?.character[0];

        const characterInformation = await getAllCharacterInfo(characterId);

        const corporation = characterInformation.corporationInfo;
        const corporationUrl = `https://evewho.com/corporation/${corporation.corporation_id}`;

        const corporationhistory = characterInformation.corporationHistory;

        const alliance = characterInformation.allianceInfo;
        const allianceUrl = `https://evewho.com/alliance/${alliance.alliance_id}`;

        const characterImage = characterInformation.characterPortrait.px256x256;
        const allianceImage = characterInformation.allianceImage.px64x64;
        const corporationImage = characterInformation.corporationImage.px128x128;


        const embed = await new EmbedBuilder()
            .setColor(0xFFFF00)
            .setAuthor({ name: `[${alliance.name}](${allianceUrl})`, iconURL: allianceImage })
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

        if (corporationhistory.length > 0) {
            for (const corporation of corporationhistory.slice(0, 15)) {
                const corporationInfo = await getCorporationInfo(corporation.corporation_id);
                const joinedDate = new Date(corporation.start_date).toLocaleDateString();
                embed.addField(`[${corporationInfo.name}](https://evewho.com/corporation/${corporation.corporation_id})`, `${joinedDate}`,);
            }
        }

        return embed;
    } else {
        const embed = await new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(searchTerm)
            .setDescription('Character not found. Please try again.')
            .setTimestamp();
        return embed;
    }

};

export { getPublicEveDataForUser };