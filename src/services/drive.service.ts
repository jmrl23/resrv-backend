import { GOOGLE_DRIVE_FOLDER_ID, googleOAuth2Client } from '../configurations'
import { google } from 'googleapis'
import { lookup } from 'mime-types'
import { createReadStream, existsSync } from 'fs'
import { InternalServerError } from 'express-response-errors'

export const drive = google.drive({
  version: 'v3',
  auth: googleOAuth2Client
})

export const driveUpload = async (file: string) => {
  try {
    if (!existsSync(file)) throw new Error('File not found')
    const mimeType = lookup(file)
    if (!mimeType) throw new Error('Unknown mimetype')
    const name = file.replace(/^.*[\\/]/, '')
    const response = await drive.files.create({
      media: {
        mimeType,
        body: createReadStream(file)
      },
      requestBody: {
        mimeType,
        name,
        parents: [GOOGLE_DRIVE_FOLDER_ID]
      }
    })
    if (response.status !== 200 || !response?.data?.id)
      throw new Error('An error occurs')
    const { data } = response
    return data
  } catch (error) {
    if (error instanceof Error) return new InternalServerError(error.message)
  }
}
