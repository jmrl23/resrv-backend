import type { NextFunction, Response, Request } from 'express'
import { Router } from 'express'
import { sendMail } from '../services'
import { InternalServerError } from 'express-response-errors'
import { Role } from '@prisma/client'
import { authorization, blockDisabled, body } from '../middlewares'
import { GmailSendEmail } from '../types/dto'

const controller = Router()

controller.post(
  '/send',
  authorization(Role.ADMIN, Role.REGISTRY),
  blockDisabled,
  body(GmailSendEmail),
  async function (request: Request, response: Response, next: NextFunction) {
    try {
      const data = await sendMail(request.body)
      response.json(data)
    } catch (error) {
      if (error instanceof Error)
        return next(new InternalServerError(error.message))
    }
  }
)

export { controller }
