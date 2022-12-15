import type { NextFunction, Response, Request } from 'express'
import { Role } from '@prisma/client'
import { Router } from 'express'
import { BadRequestError, InternalServerError } from 'express-response-errors'
import { authorization, body } from '../middlewares'
import { db } from '../services'
import {
  DepartmentCreate,
  DepartmentDelete,
  DepartmentGet,
  DepartmentList,
  DepartmentToggle,
  DepartmentUpdate
} from '../types/dto'

const controller = Router()

controller

  .post(
    '/list',
    body(DepartmentList),
    authorization(Role.ADMIN, Role.REGISTRY, Role.STUDENT),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { take, skip, keyword, isDisabled } = request.body
        const departments = await db.department.findMany({
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
        response.json(departments)
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
    body(DepartmentCreate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const data = await db.department.create({ data: request.body })
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
    body(DepartmentGet),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id } = request.body
        const departments = await db.department.findUnique({
          where: { id }
        })
        response.json(departments)
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
    body(DepartmentUpdate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id, name, alias, color } = request.body
        const data = await db.department.update({
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
    body(DepartmentToggle),
    async function (request: Request, response: Response, next: NextFunction) {
      const { id, state } = request.body
      try {
        const data = await db.department.update({
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
    body(DepartmentDelete),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id } = request.body
        const data = await db.department.delete({
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
