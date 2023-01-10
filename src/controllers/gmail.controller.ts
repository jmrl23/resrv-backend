import type { NextFunction, Response, Request } from 'express'
import { Router } from 'express'
import { dbLog, sendMail } from '../services'
import { InternalServerError } from 'express-response-errors'
import { Role } from '@prisma/client'
import { authorization, blockDisabled, body } from '../middlewares'
import { GmailSend } from '../types/dto'
import { User } from '../types'

const controller = Router()

controller.post(
  '/send',
  authorization(Role.ADMIN, Role.REGISTRY),
  blockDisabled,
  body(GmailSend),
  async function (request: Request, response: Response, next: NextFunction) {
    try {
      const data = await sendMail(request.body)
      await dbLog(
        (request?.user as User)?.id,
        `[SERVICE] GMAIL.SEND ${
          (data as unknown as Record<string, unknown>)?.id
        }`
      )
      response.json(data)
    } catch (error) {
      if (error instanceof Error)
        return next(new InternalServerError(error.message))
    }
  }
)

export { controller }
