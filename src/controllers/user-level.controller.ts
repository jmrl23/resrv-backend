import type { NextFunction, Response, Request } from 'express'
import { Role } from '@prisma/client'
import { Router } from 'express'
import { UserLevelSet } from '../types/dto'
import { authorization, blockDisabled, body } from '../middlewares'
import { BadRequestError } from 'express-response-errors'
import { tryToPrismaError } from 'prisma-errors'
import { db, dbLog } from '../services'
import { User } from '../types'

const controller = Router()

controller.post(
  '/set',
  authorization(Role.ADMIN),
  blockDisabled,
  body(UserLevelSet),
  async function (request: Request, response: Response, next: NextFunction) {
    try {
      const { email } = request.body
      const userLevel = await db.userLevel.upsert({
        where: { email },
        update: request.body,
        create: request.body,
        include: {
          User: true
        }
      })
      await dbLog(
        (request?.user as User)?.id,
        `[USERLEVEL] SET ${userLevel.id}`
      )
      response.json(userLevel)
    } catch (error) {
      console.error(error)
      if (error instanceof Error)
        return next(new BadRequestError(tryToPrismaError(error).message))
    }
  }
)

export { controller }
