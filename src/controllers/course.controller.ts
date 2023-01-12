import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import {
  CourseCreate,
  CourseDelete,
  CourseGet,
  CourseList,
  CourseUpdate
} from '../types/dto'
import { Role } from '@prisma/client'
import { authorization, blockDisabled, body } from '../middlewares'
import { db, dbLog } from '../services'
import { BadRequestError, HttpError } from 'express-response-errors'
import { User } from '../types'
import { tryToPrismaError } from 'prisma-errors'

const controller = Router()

controller
  .post(
    '/create',
    authorization(Role.ADMIN, Role.REGISTRY),
    blockDisabled,
    body(CourseCreate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const course = await db.course.create({ data: request.body })
        await dbLog((request?.user as User)?.id, `[COURSE] CREATE ${course.id}`)
        response.json(course)
      } catch (error) {
        console.error(error)
        if (error instanceof HttpError) return next(error)
        if (error instanceof Error)
          return next(new BadRequestError(tryToPrismaError(error).message))
      }
    }
  )

  .post(
    '/list',
    authorization(Role.ADMIN, Role.REGISTRY, Role.STUDENT),
    blockDisabled,
    body(CourseList),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { take, skip, term, keywords, enabled } = request.body
        const courses = await db.course.findMany({
          where: {
            enabled,
            name: {
              search: keywords?.join(' ')
            },
            alias: {
              search: keywords?.join(' ')
            },
            term
          },
          skip,
          take,
          orderBy: { lastUpdated: 'desc' }
        })
        response.json(courses)
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
    body(CourseGet),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id } = request.body
        const course = await db.course.findUnique({
          where: { id }
        })
        response.json(course)
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
    body(CourseUpdate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id } = request.body
        delete request.body.id
        console.log(request.body)
        const course = await db.course.update({
          where: { id },
          data: request.body
        })
        await dbLog((request?.user as User)?.id, `[COURSE] UPDATE ${course.id}`)
        response.json(course)
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
    body(CourseDelete),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id } = request.body
        const course = await db.course.delete({
          where: { id }
        })
        await dbLog((request?.user as User)?.id, `[COURSE] DELETE ${course.id}`)
        response.json(course)
      } catch (error) {
        console.error(error)
        if (error instanceof HttpError) return next(error)
        if (error instanceof Error)
          return next(new BadRequestError(tryToPrismaError(error).message))
      }
    }
  )

export { controller }
