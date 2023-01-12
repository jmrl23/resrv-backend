import type { NextFunction, Response, Request } from 'express'
import { Role } from '@prisma/client'
import { Router } from 'express'
import { BadRequestError, HttpError } from 'express-response-errors'
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
import { tryToPrismaError } from 'prisma-errors'

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
          return next(new BadRequestError(tryToPrismaError(error).message))
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
        const programs = await db.program.findMany({
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
        response.json(programs)
      } catch (error) {
        console.error(error)
        if (error instanceof HttpError) return next(error)
        if (error instanceof Error)
          return next(new BadRequestError(tryToPrismaError(error).message))
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
        const program = await db.program.findUnique({
          where: { id }
        })
        response.json(program)
      } catch (error) {
        console.error(error)
        if (error instanceof HttpError) return next(error)
        if (error instanceof Error)
          return next(new BadRequestError(tryToPrismaError(error).message))
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
        delete request.body.id
        const data = await db.program.update({
          where: { id },
          data: request.body
        })
        await dbLog((request?.user as User)?.id, `[PROGRAM] UPDATE ${data.id}`)
        response.json(data)
      } catch (error) {
        console.error(error)
        if (error instanceof HttpError) return next(error)
        if (error instanceof Error)
          return next(new BadRequestError(tryToPrismaError(error).message))
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
        if (error instanceof HttpError) return next(error)
        if (error instanceof Error)
          return next(new BadRequestError(tryToPrismaError(error).message))
      }
    }
  )

export { controller }
