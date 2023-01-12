import express from 'express'
import { controller } from './controllers'
import { TRUST_PROXY } from './configurations'
import {
  responseErrorHandler,
  cors,
  helmet,
  logger,
  rateLimiter,
  requestUser,
  notFound
} from './middlewares'
import passport from 'passport'

const app = express()

app.set('trust proxy', TRUST_PROXY)

app.use(
  helmet,
  cors,
  logger,
  passport.initialize(),
  express.json(),
  express.urlencoded({ extended: false }),
  requestUser
)

app.use(rateLimiter({ max: 800 }), controller)

app.use(notFound, responseErrorHandler)

export { app }
