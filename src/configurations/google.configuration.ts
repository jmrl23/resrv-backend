import { google } from 'googleapis'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_PLAYGROUND_URL,
  GOOGLE_REFRESH_TOKEN
} from './env.configuration'

const googleOAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_PLAYGROUND_URL
)

googleOAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })

export { googleOAuth2Client }
