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

// configurations
app.set('trust proxy', TRUST_PROXY)

// middlewares
app.use(
  helmet,
  cors,
  logger,
  passport.initialize(),
  express.json(),
  express.urlencoded({ extended: false }),
  requestUser
)

// end-points
app.use(rateLimiter({ max: 800 }), controller)

// error handler
app.use(notFound, responseErrorHandler)

export { app }
