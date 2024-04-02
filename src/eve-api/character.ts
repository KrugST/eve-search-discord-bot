import axios from 'axios';
import { getCorporationInfo, getCorporationImage } from './corporations';
import { getAllianceInfo, getAllianceImage } from '../eve-api/alliances';

async function getCharacterInfo(characterId) {
    const options = {
        method: 'GET',
        url: `https://esi.evetech.net/latest/characters/${characterId}/?datasource=tranquility`,
        headers: {
            'accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (error) {
        if (error.response.status !== 403) {
            console.error(error);
        }
        throw error;
    }
}

async function getCharacterPortrait(characterId) {
    const options = {
        method: 'GET',
        url: `https://esi.evetech.net/latest/characters/${characterId}/portrait/?datasource=tranquility`,
        headers: {
            'accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    };
    try {
        const response = await axios(options);
        return response.data;
    } catch (error) {
        if (error.response.status !== 403) {
            console.error(error);
        }
        throw error;
    }
}

async function getCharacterCorporationHistory(characterId) {
    const options = {
        method: 'GET',
        url: `https://esi.evetech.net/latest/characters/${characterId}/corporationhistory/?datasource=tranquility`,
        headers: {
            'accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    };
    try {
        const response = await axios(options);
        return response.data;
    } catch (error) {
        if (error.response.status !== 403) {
            console.error(error);
        }
        throw error;
    }
}

async function findCharIdByNameUsingCharacterWithScope(access_token, name, characterId) {
    const options = {
        method: 'GET',
        url: `https://esi.evetech.net/latest/characters/${characterId}/search/?categories=character&datasource=tranquility&language=en&search=${encodeURIComponent(name)}&strict=True`,
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'en',
            'Cache-Control': 'no-cache',
            'authorization': `Bearer ${access_token}`
        }
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (error) {
        if (error.response.status !== 403) {
            console.error(error);
        }
        throw error;
    }
}

async function getAllCharacterInfo(characterId, retryCount = 0) {
    try {
        const characterInfo = await getCharacterInfo(characterId);
        const characterCorporationHistory = await getCharacterCorporationHistory(characterId);
        const characterPortrait = await getCharacterPortrait(characterId);
        let lastCorporationId;
        if (characterCorporationHistory.length > 0) {
            lastCorporationId = characterCorporationHistory[0].corporation_id;
        } else {
            lastCorporationId = characterInfo.corporation_id
        }
        const corporationInfo = await getCorporationInfo(lastCorporationId);
        const corporationImage = await getCorporationImage(lastCorporationId);
        corporationInfo.corporation_id = lastCorporationId;
        let allianceInfo = {}, allianceImage = {};
        if (corporationInfo.alliance_id) {
            allianceInfo = await getAllianceInfo(corporationInfo.alliance_id);
            allianceImage = await getAllianceImage(corporationInfo.alliance_id);
        } else {
            allianceInfo.name = 'No Alliance';
            allianceImage.px64x64 = 'https://images.evetech.net/corporations/0/logo?size=64';
        }

        characterInfo.characterCorporationHistory = characterCorporationHistory;
        characterInfo.characterPortrait = characterPortrait;
        characterInfo.corporationInfo = corporationInfo;
        characterInfo.corporationImage = corporationImage;
        characterInfo.allianceInfo = allianceInfo;
        characterInfo.allianceImage = allianceImage;
        return characterInfo;
    } catch (error) {
        if (error.statusCode === 503 && retryCount < 3) {
            console.log('Error 503 encountered. Retrying...');
            await new Promise(resolve => setTimeout(resolve, 2000)); // wait for 2 seconds before retrying
            return getAllCharacterInfo(characterId, retryCount + 1);
        } else {
            throw error; // re-throw the error if it's not 503 or if we've retried 3 times already
        }
    }
}

export { getCharacterInfo, getCharacterPortrait, getCharacterCorporationHistory, findCharIdByNameUsingCharacterWithScope, getAllCharacterInfo };