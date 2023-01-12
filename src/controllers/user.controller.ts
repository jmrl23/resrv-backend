/* eslint-disable indent */
import type { NextFunction, Request, Response } from 'express'
import { User } from './../types'
import { Role } from '@prisma/client'
import { Router } from 'express'
import { authorization, blockDisabled, body } from '../middlewares'
import { UserGet, UserList, UserUpdate } from '../types/dto'
import { BadRequestError, UnauthorizedError } from 'express-response-errors'
import { cache, cached, db, dbLog } from '../services'
import { tryToPrismaError } from 'prisma-errors'

const controller = Router()

controller

  .get(
    '/current',
    authorization(Role.ADMIN, Role.REGISTRY, Role.STUDENT),
    function (request: Request, response: Response) {
      response.json(request.user)
    }
  )

  .post(
    '/list',
    authorization(Role.ADMIN, Role.REGISTRY),
    blockDisabled,
    body(UserList),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { role, take, skip, keywords, enabled, programId, studentId } =
          request.body
        const users = await db.user.findMany({
          where: {
            enabled,
            UserLevel: {
              role: { in: role }
            },
            givenName: {
              search: keywords?.join(' ')
            },
            familyName: {
              search: keywords?.join(' ')
            },
            email: {
              search: keywords?.join(' ')
            },
            StudentInformation: {
              programId,
              studentId
            }
          },
          skip,
          take,
          orderBy: {
            lastUpdated: 'desc'
          },
          include: {
            UserLevel: true,
            StudentInformation: true
          }
        })
        response.json(users)
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
    body(UserGet),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const user = request.user as User
        const { id } = request.body
        if (user?.UserLevel?.role === Role.STUDENT && user.id !== id) {
          return next(
            new UnauthorizedError('Unauthorized to get requested data')
          )
        }
        const data = await cached(
          `user.${id}`,
          () =>
            db.user.findUnique({
              where: { id },
              include: {
                UserLevel: true,
                StudentInformation: true
              }
            }),
          30_000
        )
        response.json(data)
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
    body(UserUpdate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        if (
          (request?.user as User)?.id === request?.body?.id &&
          typeof request.body?.UserLevel?.role !== 'undefined'
        )
          return next(new BadRequestError('Cannot perform the request'))
        const user = request?.user as User
        if (user) {
          if (
            user.id === request.body.id &&
            (typeof request.body.enabled !== 'undefined' ||
              typeof request.body.UserLevel !== 'undefined')
          )
            return next(new BadRequestError('Cannot perform the request'))
          if (
            user?.UserLevel?.role !== 'ADMIN' &&
            typeof request.body.enabled !== 'undefined'
          )
            return next(new BadRequestError('Cannot perform the request'))
        }
        const requestBody = { ...request.body }
        const UserLevel = { ...requestBody.UserLevel }
        const StudentInformation = { ...requestBody.StudentInformation }
        delete requestBody.UserLevel
        delete requestBody.StudentInformation
        const data = await db.user.update({
          where: { id: request.body.id },
          data: {
            ...requestBody,
            UserLevel: {
              update: {
                role: UserLevel.role
              }
            },
            StudentInformation:
              Object.keys(StudentInformation).length > 0
                ? {
                    upsert: {
                      update: {
                        studentType: StudentInformation?.studentType,
                        gender: StudentInformation?.gender,
                        studentId: StudentInformation?.studentId,
                        contactNumber: StudentInformation?.contactNumber,
                        address: StudentInformation?.address,
                        Program: StudentInformation?.programId
                          ? {
                              connect: {
                                id: StudentInformation?.programId
                              }
                            }
                          : undefined,
                        ClassSection: StudentInformation?.classSectionId
                          ? {
                              connect: {
                                id: StudentInformation?.classSectionId
                              }
                            }
                          : undefined
                      },
                      create: {
                        studentType: StudentInformation?.studentType,
                        gender: StudentInformation?.gender,
                        studentId: StudentInformation?.studentId,
                        contactNumber: StudentInformation?.contactNumber,
                        address: StudentInformation?.address,
                        Program: {
                          connect: {
                            id: StudentInformation?.programId
                          }
                        },
                        ClassSection: {
                          connect: {
                            id: StudentInformation?.classSectionId
                          }
                        }
                      }
                    }
                  }
                : undefined
          },
          include: {
            UserLevel: true,
            StudentInformation: true
          }
        })
        await dbLog((request?.user as User)?.id, `[USER] UPDATE ${data.id}`)
        if (request.body?.id === (request?.user as User)?.id)
          await cache.put(`user.${request.body?.id}`, data, 60_000)
        response.json(data)
      } catch (error) {
        console.error(error)
        if (error instanceof Error)
          return next(new BadRequestError(tryToPrismaError(error).message))
      }
    }
  )

export { controller }
