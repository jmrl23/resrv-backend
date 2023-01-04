import { Request, Response, Router } from 'express'
import { CLIENT_URL } from '../configurations'

const controller = Router()

controller.all('/', function (_request: Request, response: Response) {
  response.redirect(CLIENT_URL)
})

export { controller }
