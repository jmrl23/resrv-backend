import { Router } from 'express'
import type { NextFunction, Response, Request } from 'express'
import { authorization, blockDisabled, body } from '../middlewares'
import {
  ReservationCreate,
  ReservationGet,
  ReservationList,
  ReservationUpdate
} from '../types/dto'
import { Role } from '@prisma/client'
import { BadRequestError } from 'express-response-errors'
import { tryToPrismaError } from 'prisma-errors'
import { db, dbLog } from '../services'
import { User } from '../types'

const controller = Router()

controller
  .post(
    '/create',
    authorization(Role.STUDENT),
    blockDisabled,
    body(ReservationCreate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const role = (request?.user as User)?.UserLevel?.role
        if (role !== Role.STUDENT) throw new Error('Not a student')
        const { fileId, courseScheduleIds } = request.body
        const reservation = await db.reservation.create({
          data: {
            fileId,
            studentInformationId: (request?.user as User)?.StudentInformation
              ?.id,
            CourseSchedule: {
              connectOrCreate: courseScheduleIds.map((id: string) => ({
                where: {
                  id
                },
                create: {
                  courseScheduleId: id
                }
              }))
            }
          },
          include: {
            File: true,
            CourseSchedule: true
          }
        })
        await dbLog(
          (request?.user as User)?.id,
          `[RESERVATION] CREATE ${reservation.id}`
        )
        response.json(reservation)
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
    body(ReservationList),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const reservations = await db.reservation.findMany({
          where: request.body,
          include: {
            File: true,
            CourseSchedule: true
          },
          orderBy: {
            lastUpdated: 'desc'
          }
        })
        response.json(reservations)
      } catch (error) {
        console.error(error)
        if (error instanceof Error)
          return next(new BadRequestError(tryToPrismaError(error).message))
      }
    }
  )

  .post(
    '/get',
    authorization(Role.ADMIN, Role.REGISTRY, Role.STUDENT),
    blockDisabled,
    body(ReservationGet),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const reservation = await db.reservation.findUnique({
          where: request.body,
          include: {
            File: true,
            CourseSchedule: true
          }
        })
        response.json(reservation)
      } catch (error) {
        console.error(error)
        if (error instanceof Error)
          return next(new BadRequestError(tryToPrismaError(error).message))
      }
    }
  )

  .post(
    '/update',
    authorization(Role.ADMIN, Role.REGISTRY, Role.STUDENT),
    blockDisabled,
    body(ReservationUpdate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id, fileId, status } = request.body
        const reservation = await db.reservation.update({
          where: {
            id
          },
          data: {
            fileId,
            status
          }
        })
        await dbLog(
          (request?.user as User)?.id,
          `[RESERVATION] UPDATE ${reservation.id}`
        )
        response.json(reservation)
      } catch (error) {
        console.error(error)
        if (error instanceof Error)
          return next(new BadRequestError(tryToPrismaError(error).message))
      }
    }
  )

export { controller }
