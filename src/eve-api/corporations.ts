import axios from 'axios';
async function getCorporationInfo(corporationId: number) {
    const options = {
        method: 'GET',
        url: `https://esi.evetech.net/latest/corporations/${corporationId}/?datasource=tranquility`,
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

async function getCorporationImage(corporationId: number) {
    const options = {
        method: 'GET',
        url: `https://esi.evetech.net/latest/corporations/${corporationId}/icons/?datasource=tranquility`,
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

export {
    getCorporationInfo,
    getCorporationImage,
};