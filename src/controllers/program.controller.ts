import type { NextFunction, Response, Request } from 'express'
import { Role } from '@prisma/client'
import { Router } from 'express'
import { BadRequestError, InternalServerError } from 'express-response-errors'
import { authorization, blockDisabled, body } from '../middlewares'
import { db, dbLog } from '../services'
import {
  ProgramCreate,
  ProgramDelete,
  ProgramGet,
  ProgramList,
  ProgramUpdate
} from '../types/dto'
import { User } from '../types'

const controller = Router()

controller

  .post(
    '/create',
    authorization(Role.ADMIN, Role.REGISTRY),
    blockDisabled,
    body(ProgramCreate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const data = await db.program.create({ data: request.body })
        await dbLog((request?.user as User)?.id, `[PROGRAM] CREATE ${data.id}`)
        response.json(data)
      } catch (error) {
        console.error(error)
        if (error instanceof Error)
          return next(
            new BadRequestError(
              'Cannot process your request, please check your inputs and try again'
            )
          )
      }
    }
  )

  .post(
    '/list',
    authorization(Role.ADMIN, Role.REGISTRY, Role.STUDENT),
    blockDisabled,
    body(ProgramList),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { take, skip, keywords, enabled } = request.body
        const Programs = await db.program.findMany({
          where: {
            enabled,
            name: {
              search: keywords?.join(' ')
            },
            alias: {
              search: keywords?.join(' ')
            }
          },
          skip,
          take,
          orderBy: { lastUpdated: 'desc' }
        })
        response.json(Programs)
      } catch (error) {
        console.error(error)
        if (error instanceof Error)
          return next(new InternalServerError(error.message))
      }
    }
  )

  .post(
    '/get',
    authorization(Role.ADMIN, Role.REGISTRY, Role.STUDENT),
    blockDisabled,
    body(ProgramGet),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id } = request.body
        const Programs = await db.program.findUnique({
          where: { id }
        })
        response.json(Programs)
      } catch (error) {
        console.error(error)
        if (error instanceof Error)
          return next(new InternalServerError(error.message))
      }
    }
  )

  .post(
    '/update',
    authorization(Role.ADMIN, Role.REGISTRY),
    blockDisabled,
    body(ProgramUpdate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id } = request.body
        const data = await db.program.update({
          where: { id },
          data: request.body
        })
        await dbLog((request?.user as User)?.id, `[PROGRAM] UPDATE ${data.id}`)
        response.json(data)
      } catch (error) {
        console.error(error)
        if (error instanceof Error)
          return next(
            new BadRequestError(
              'Cannot process your request, please check your inputs and try again'
            )
          )
      }
    }
  )

  .post(
    '/delete',
    authorization(Role.ADMIN, Role.REGISTRY),
    blockDisabled,
    body(ProgramDelete),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id } = request.body
        const data = await db.program.delete({
          where: { id }
        })
        await dbLog((request?.user as User)?.id, `[PROGRAM] DELETE ${data.id}`)
        response.json(data)
      } catch (error) {
        console.error(error)
        if (error instanceof Error)
          return next(new BadRequestError('Cannot process your request'))
      }
    }
  )

export { controller }
