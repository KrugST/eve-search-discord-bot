import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, EVE_ENCRYPTED_CLIENT_SECRET, ACCESS_TOKEN, REFRESH_TOKEN, EVE_ESI_CHARACTER_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
    throw new Error("Missing discord tokens variables");
}
if (!EVE_ENCRYPTED_CLIENT_SECRET) {
    throw new Error("Missing EVE Encrypted Client Secret");
}
if (!ACCESS_TOKEN || !REFRESH_TOKEN) {
    throw new Error("Missing EVE Access or Refresh Tokens");
}
if (!EVE_ESI_CHARACTER_ID) {
    throw new Error("Missing EVE ESI Character ID");
}

export const config = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    EVE_ENCRYPTED_CLIENT_SECRET,
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    EVE_ESI_CHARACTER_ID
};