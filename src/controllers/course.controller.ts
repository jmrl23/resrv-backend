import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'

const controller = Router()

controller.post(
  '/section/create',
  function (request: Request, response: Response, next: NextFunction) {
    response.end('Hello, World!')
  }
)

export { controller }
