import axios from 'axios';
import { config } from '../config/config';

interface AuthorizationObject {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

async function refreshTokens(autorization, encryptedClientSecret) {
    const options = {
        method: 'POST',
        url: 'https://login.eveonline.com/v2/oauth/token',
        headers: {
            'Authorization': 'Basic ' + encryptedClientSecret,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
            'grant_type': 'refresh_token',
            'refresh_token': autorization.refresh_token
        }
    };

    try {
        const response = await axios(options);
        if (response.status === 200) {
            autorization.access_token = response.data.access_token;
            autorization.refresh_token = response.data.refresh_token;
            return autorization;
        }
    } catch (error) {
        console.error(error);
    }
}

async function callApiWithTokenRefresh({ apiFunction, autorizationObject, args = [], maxRetries = 3 }: 
    { apiFunction: Function, autorizationObject: AuthorizationObject, args?: any[], maxRetries?: number }) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const response = await apiFunction(...args);
            return response;
        } catch (error) {
            if (error.response.status === 403) {
                console.log(`Token expired. Refreshing with callApiWithTokenRefresh...`);
                const refreshedTokens = await refreshTokens(autorizationObject, config.EVE_ENCRYPTED_CLIENT_SECRET);
                config.ACCESS_TOKEN = refreshedTokens.access_token;
                config.REFRESH_TOKEN = refreshedTokens.refresh_token;
                args[0] = refreshedTokens.access_token;
                return await apiFunction(...args);
            } else if (error.response.status === 504) {
                console.log('504 error. Retrying...');
                retries++;
            } else {
                throw error;
            }
        }
    }
}

export { callApiWithTokenRefresh };