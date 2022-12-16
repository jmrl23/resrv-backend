import type { NextFunction, Request, Response } from 'express'
import { User } from './../types/user'
import { Role } from '@prisma/client'
import { Router } from 'express'
import { authorization, blockDisabled, body } from '../middlewares'
import {
  UserGet,
  UserList,
  UserRemoveRole,
  UserSetRole,
  UserToggle
} from '../types/dto'
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError
} from 'express-response-errors'
import { db } from '../services'

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
        const { role, take, skip, keyword, isDisabled, departmentId } =
          request.body
        const users = await db.user.findMany({
          where: {
            isDisabled,
            StudentInformation: {
              departmentId
            },
            AND: [
              { UserLevel: { role: { in: role } } },
              {
                OR: [
                  { givenName: { contains: keyword ?? '' } },
                  { email: { contains: keyword ?? '' } },
                  {
                    StudentInformation: {
                      studentId: { contains: keyword ?? '' }
                    }
                  }
                ]
              }
            ]
          },
          skip,
          take,
          include: {
            UserLevel: true,
            StudentInformation: request.body?.role === Role.STUDENT
          }
        })
        response.json(users)
      } catch (error) {
        if (error instanceof Error)
          return next(new InternalServerError(error.message))
        next(error)
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
        const user = <User>request.user
        const { id } = request.body
        if (user?.UserLevel?.role === Role.STUDENT && user.id !== id) {
          return next(
            new UnauthorizedError('Unauthorized to get requested data')
          )
        }
        const data = await db.user.findUnique({
          where: { id },
          include: {
            UserLevel: true,
            StudentInformation: true
          }
        })
        response.json(data)
      } catch (error) {
        if (error instanceof Error)
          return next(new InternalServerError(error.message))
        next(error)
      }
    }
  )

  .post(
    '/toggle',
    authorization(Role.ADMIN, Role.REGISTRY),
    blockDisabled,
    body(UserToggle),
    async function (request: Request, response: Response, next: NextFunction) {
      const { id, state } = request.body
      const user = request.user as User
      if (user && user.id === id) return response.json(request.user)
      try {
        const data = await db.user.update({
          where: { id },
          data: { isDisabled: state }
        })
        response.json(data)
      } catch (error) {
        if (error instanceof Error) next(new BadRequestError(error.message))
      }
    }
  )

  .post(
    '/set-role',
    authorization(Role.ADMIN),
    blockDisabled,
    body(UserSetRole),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { email, role } = request.body
        if (email === (request.user as User)?.email)
          return next(new BadRequestError('Cannot modify own data'))
        const userLevel = await db.userLevel.upsert({
          where: { email },
          update: { role },
          create: { email, role }
        })
        const user = await db.user.findUnique({ where: { email } })
        if (user) {
          await db.user.update({
            where: { email },
            data: { isDisabled: false, userLevelId: userLevel.id }
          })
        }
        response.json(userLevel)
      } catch (error) {
        if (error instanceof Error) next(new BadRequestError(error.message))
      }
    }
  )

  .post(
    '/remove-role',
    authorization(Role.ADMIN),
    blockDisabled,
    body(UserRemoveRole),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { email } = request.body
        if (email === (request.user as User)?.email)
          return next(new BadRequestError('Cannot modify own data'))
        const result = await db.userLevel.delete({
          where: { email },
          include: { User: true }
        })
        if (result.User) {
          await db.user.update({
            where: { id: result.User.id },
            data: { isDisabled: true },
            include: { UserLevel: true }
          })
        }
        response.json(result)
      } catch (error) {
        if (error instanceof Error) next(new BadRequestError(error.message))
      }
    }
  )

export { controller }
