import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, EVE_ENCRYPTED_CLIENT_SECRET, ACCESS_TOKEN, REFRESH_TOKEN } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
    throw new Error("Missing discord tokens variables");
}
if (!EVE_ENCRYPTED_CLIENT_SECRET) {
    throw new Error("Missing EVE Encrypted Client Secret");
}
if (!ACCESS_TOKEN || !REFRESH_TOKEN) {
    throw new Error("Missing EVE Access or Refresh Tokens");
}

export const config = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    EVE_ENCRYPTED_CLIENT_SECRET,
    ACCESS_TOKEN,
    REFRESH_TOKEN,
};