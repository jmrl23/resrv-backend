import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { cached, dbLog, drive, driveUpload } from '../services'
import { tmpdir } from 'os'
import { v4 as uuidv4 } from 'uuid'
import {
  BadRequestError,
  HttpError,
  InternalServerError,
  NotFoundError
} from 'express-response-errors'
import { db } from '../services'
import { User } from '../types'
import { authorization, blockDisabled } from '../middlewares'
import { File, Role } from '@prisma/client'
import { extname } from 'path'
import multer from 'multer'
import { tryToPrismaError } from 'prisma-errors'

const controller = Router()

const storage = multer.diskStorage({
  destination: tmpdir(),
  filename(_req, file, callback) {
    const fileName = `${Date.now()}_${uuidv4()}${extname(file.originalname)}`
    callback(null, fileName)
  }
})

const upload = multer({
  storage,
  limits: {
    fieldSize: 5242880
  }
})

controller
  .post(
    '/upload',
    authorization(Role.ADMIN, Role.REGISTRY, Role.STUDENT),
    blockDisabled,
    upload.single('f'),
    async function (request: Request, response: Response, next: NextFunction) {
      if (!request.file) return next(new BadRequestError('No file'))
      const data = await driveUpload(request.file.path)
      if (!data) return next(new InternalServerError('An error occurs'))
      if (data instanceof Error) return next(new BadRequestError(data.message))
      try {
        const user = request.user as User
        const uploadedFile = await db.file.create({
          data: {
            fileId: data.id as string,
            mimeType: data.mimeType as string,
            userId: user?.id,
            size: request.file.size
          }
        })
        await dbLog(
          (request?.user as User)?.id,
          `[SERVICE] DRIVE.UPLOAD ${
            (data as unknown as Record<string, unknown>)?.id
          }`
        )
        response.json(uploadedFile)
      } catch (error) {
        console.error(error)
        if (error instanceof HttpError) return next(error)
        if (error instanceof Error)
          return next(new BadRequestError(tryToPrismaError(error).message))
      }
    }
  )
  .get(
    '/get/:id([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})',
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const id = request.params.id
        const file = await cached<File>(
          `drive.file.${id}`,
          () =>
            db.file.findUnique({
              where: { id }
            }),
          300_000
        )
        if (!file) return next(new NotFoundError('File not found'))
        const data = await drive.files.get(
          {
            fileId: file.fileId,
            alt: 'media'
          },
          { responseType: 'stream' }
        )
        response.setHeader('Content-Type', file.mimeType)
        // Stream directly from Google drive
        // pro: prevents resource bloating
        // con: prevents caching
        data.data.pipe(response)
      } catch (error) {
        console.error(error)
        if (error instanceof HttpError) return next(error)
        if (error instanceof Error)
          return next(new BadRequestError(tryToPrismaError(error).message))
      }
    }
  )

export { controller }
