import { Request, Response, Router } from 'express'

const controller = Router()

controller.all('/', function (_request: Request, response: Response) {
  response.status(200).json({ message: 'OK' })
})

export { controller }
