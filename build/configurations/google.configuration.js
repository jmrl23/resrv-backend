"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleOAuth2Client = void 0;
const googleapis_1 = require("googleapis");
const env_configuration_1 = require("./env.configuration");
const googleOAuth2Client = new googleapis_1.google.auth.OAuth2(env_configuration_1.GOOGLE_CLIENT_ID, env_configuration_1.GOOGLE_CLIENT_SECRET, env_configuration_1.GOOGLE_PLAYGROUND_URL);
exports.googleOAuth2Client = googleOAuth2Client;
googleOAuth2Client.setCredentials({ refresh_token: env_configuration_1.GOOGLE_REFRESH_TOKEN });
