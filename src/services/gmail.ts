import { SendMailOptions, createTransport } from 'nodemailer'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  SMTP_TRANSPORT_URL
} from '../configurations'

export const transportURL = new URL(SMTP_TRANSPORT_URL)

export const transporter = createTransport({
  host: transportURL.hostname,
  port: parseInt(transportURL.port, 10),
  secure: transportURL.port === '465',
  service: 'gmail',
  auth: {
    type: 'oauth2',
    user: decodeURIComponent(transportURL.username),
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    refreshToken: GOOGLE_REFRESH_TOKEN
  }
})

export const sendMail = async (options: SendMailOptions) => {
  try {
    const response = await transporter.sendMail(options)
    return response
  } catch (error) {
    if (error instanceof Error) return error
  }
}
