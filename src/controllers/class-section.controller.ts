import { NextFunction, Request, Response, Router } from 'express'
import { authorization, blockDisabled, body } from '../middlewares'
import { Role } from '@prisma/client'
import {
  ClassSectionCreate,
  ClassSectionDelete,
  ClassSectionGet,
  ClassSectionList,
  ClassSectionUpdate
} from '../types/dto'
import {
  BadRequestError,
  ForbiddenError,
  HttpError,
  NotFoundError
} from 'express-response-errors'
import { db, dbLog } from '../services'
import { User } from '../types'
import { tryToPrismaError } from 'prisma-errors'

const controller = Router()

controller
  .post(
    '/create',
    authorization(Role.ADMIN, Role.REGISTRY),
    blockDisabled,
    body(ClassSectionCreate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { yearLevel, programId } = request.body
        const program = await db.program.findUnique({
          where: {
            id: programId
          }
        })
        if (!program) throw new NotFoundError('Program not found')
        const maxYearCount = program.yearCount
        if (!yearLevel || yearLevel > maxYearCount)
          throw new ForbiddenError('Invalid year level')
        const classSection = await db.classSection.create({
          data: request.body
        })
        await dbLog(
          (request?.user as User)?.id,
          `[CLASSSECTION] CREATE ${classSection.id}`
        )
        response.json(classSection)
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
    body(ClassSectionList),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { keywords, programId, yearLevel, skip, take } = request.body
        const classSections = await db.classSection.findMany({
          where: {
            programId,
            yearLevel,
            name: {
              search: keywords?.join(' ')
            }
          },
          skip,
          take,
          orderBy: {
            name: 'asc'
          }
        })
        response.json(classSections)
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
    body(ClassSectionGet),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const classSection = await db.classSection.findUnique({
          where: request.body,
          include: {
            CourseSchedule: true,
            StudentInformation: true
          }
        })
        response.json(classSection)
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
    body(ClassSectionUpdate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id } = request.body
        delete request.body.id
        const data = await db.classSection.update({
          where: { id },
          data: request.body,
          include: {
            CourseSchedule: true,
            StudentInformation: true
          }
        })
        await dbLog(
          (request?.user as User)?.id,
          `[CLASSSECTION] UPDATE ${data.id}`
        )
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
    body(ClassSectionDelete),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const data = await db.classSection.delete({
          where: request.body,
          include: {
            CourseSchedule: true,
            StudentInformation: true
          }
        })
        await dbLog(
          (request?.user as User)?.id,
          `[CLASSSECTION] DELETE ${data.id}`
        )
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
