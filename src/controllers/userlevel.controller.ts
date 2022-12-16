import { Role } from '@prisma/client'
import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { authorization, blockDisabled, body } from '../middlewares'
import { UserLevelList } from '../types/dto'
import { db } from '../services'
import { InternalServerError } from 'express-response-errors'

const controller = Router()

controller.post(
  '/list',
  authorization(Role.ADMIN),
  blockDisabled,
  body(UserLevelList),
  async function (request: Request, response: Response, next: NextFunction) {
    try {
      const { role } = request.body
      const userLevels = await db.userLevel.findMany({
        where: {
          role: { in: role }
        },
        include: {
          User: true
        },
        orderBy: {
          lastUpdated: 'desc'
        }
      })
      response.json(userLevels)
    } catch (error) {
      if (error instanceof Error)
        return next(new InternalServerError(error.message))
      next(error)
    }
  }
)

export { controller }
