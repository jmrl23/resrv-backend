import { Request, Response, Router } from 'express'

const controller = Router()

controller.all('/', function (_request: Request, response: Response) {
  response.status(200).json({
    statusCode: 200,
    message: 'OK',
    error: null
  })
})

export { controller }
