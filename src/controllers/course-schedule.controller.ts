import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { authorization, blockDisabled, body } from '../middlewares'
import { Role } from '@prisma/client'
import {
  CourseScheduleCreate,
  CourseScheduleDelete,
  CourseScheduleGet,
  CourseScheduleList,
  CourseScheduleUpdate
} from '../types/dto'
import { BadRequestError, HttpError } from 'express-response-errors'
import { db, dbLog } from '../services'
import { User } from '../types'
import { tryToPrismaError } from 'prisma-errors'

const controller = Router()

controller
  .post(
    '/create',
    authorization(Role.ADMIN, Role.REGISTRY),
    blockDisabled,
    body(CourseScheduleCreate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const courseSchedule = await db.courseSchedule.create({
          data: request.body
        })
        await dbLog(
          (request?.user as User)?.id,
          `[COURSESCHEDULE] CREATE ${courseSchedule.id}`
        )
        response.json(courseSchedule)
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
    authorization(Role.ADMIN, Role.REGISTRY),
    blockDisabled,
    body(CourseScheduleList),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { from, to, day, courseId, classSectionId, skip, take } =
          request.body

        console.log(from, to)
        const courseSchedules = await db.courseSchedule.findMany({
          where: {
            courseId,
            classSectionId,
            day,
            AND: {
              from: from ? { gte: new Date('0 ' + from) } : undefined,
              to: to ? { lte: new Date('0 ' + to) } : undefined
            }
          },
          skip,
          take,
          orderBy: {
            lastUpdated: 'desc'
          }
        })
        response.json(courseSchedules)
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
    authorization(Role.ADMIN, Role.REGISTRY),
    blockDisabled,
    body(CourseScheduleGet),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const courseSchedule = await db.courseSchedule.findUnique({
          where: request.body
        })
        response.json(courseSchedule)
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
    body(CourseScheduleUpdate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id } = request.body
        delete request.body.id
        if (typeof request.body?.from !== 'undefined')
          request.body.from = new Date('0 ' + request.body.from)
        if (typeof request.body?.to !== 'undefined')
          request.body.to = new Date('0 ' + request.body.to)
        const courseSchedule = await db.courseSchedule.update({
          where: { id },
          data: request.body
        })
        await dbLog(
          (request?.user as User)?.id,
          `[COURSESCHEDULE] UPDATE ${courseSchedule.id}`
        )
        response.json(courseSchedule)
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
    body(CourseScheduleDelete),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id } = request.body
        const courseSchedule = await db.courseSchedule.delete({
          where: { id }
        })
        await dbLog(
          (request?.user as User)?.id,
          `[COURSESCHEDULE] DELETE ${courseSchedule.id}`
        )
        response.json(courseSchedule)
      } catch (error) {
        console.error(error)
        if (error instanceof HttpError) return next(error)
        if (error instanceof Error)
          return next(new BadRequestError(tryToPrismaError(error).message))
      }
    }
  )

export { controller }
