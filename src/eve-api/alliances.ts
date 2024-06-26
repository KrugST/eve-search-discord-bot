import axios from 'axios';

async function getAllianceInfo(allianceId: number) {
    const options = {
        method: 'GET',
        url: `https://esi.evetech.net/latest/alliances/${allianceId}/?datasource=tranquility`,
        headers: {
            'accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (error: any) {
        if (error.response.status !== 403) {
            console.error(error);
        }
        throw error;
    }
}

async function getAllianceImage(allianceId: number) {
    const options = {
        method: 'GET',
        url: `https://esi.evetech.net/latest/alliances/${allianceId}/icons/?datasource=tranquility`,
        headers: {
            'accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (error: any) {
        if (error.response.status !== 403) {
            console.error(error);
        }
        throw error;
    }
}

export { getAllianceInfo, getAllianceImage };