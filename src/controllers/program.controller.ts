import type { NextFunction, Response, Request } from 'express'
import { Role } from '@prisma/client'
import { Router } from 'express'
import { BadRequestError, InternalServerError } from 'express-response-errors'
import { authorization, blockDisabled, body } from '../middlewares'
import { db } from '../services'
import {
  ProgramCreate,
  ProgramDelete,
  ProgramGet,
  ProgramList,
  ProgramToggle,
  ProgramUpdate
} from '../types/dto'

const controller = Router()

controller

  .post(
    '/list',
    authorization(Role.ADMIN, Role.REGISTRY, Role.STUDENT),
    blockDisabled,
    body(ProgramList),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { take, skip, keyword, isDisabled } = request.body
        const Programs = await db.program.findMany({
          where: {
            isDisabled,
            OR: [
              { name: { contains: keyword ?? '' } },
              { alias: { contains: keyword ?? '' } }
            ]
          },
          skip,
          take,
          orderBy: { lastUpdated: 'desc' }
        })
        response.json(Programs)
      } catch (error) {
        if (error instanceof Error)
          return next(new InternalServerError(error.message))
        next(error)
      }
    }
  )

  .post(
    '/create',
    authorization(Role.ADMIN, Role.REGISTRY),
    blockDisabled,
    body(ProgramCreate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const data = await db.program.create({ data: request.body })
        response.json(data)
      } catch (error) {
        if (error instanceof Error)
          return next(new BadRequestError(error.message))
        next(error)
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
        if (error instanceof Error)
          return next(new InternalServerError(error.message))
        next(error)
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
        const { id, name, alias, color } = request.body
        const data = await db.program.update({
          where: { id },
          data: { name, alias, color }
        })
        response.json(data)
      } catch (error) {
        if (error instanceof Error)
          return next(new BadRequestError(error.message))
        next(error)
      }
    }
  )

  .post(
    '/toggle',
    authorization(Role.ADMIN, Role.REGISTRY),
    blockDisabled,
    body(ProgramToggle),
    async function (request: Request, response: Response, next: NextFunction) {
      const { id, state } = request.body
      try {
        const data = await db.program.update({
          where: { id },
          data: { isDisabled: state }
        })
        response.json(data)
      } catch (error) {
        if (error instanceof Error)
          return next(new BadRequestError(error.message))
        next(error)
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
        response.json(data)
      } catch (error) {
        if (error instanceof Error)
          return next(new BadRequestError(error.message))
        next(error)
      }
    }
  )

export { controller }
