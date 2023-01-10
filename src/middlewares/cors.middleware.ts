import type { Request } from 'express'
import e from 'cors'
import { CORS_WHITELIST } from '../configurations'
import { ForbiddenError } from 'express-response-errors'

export const cors = e<Request>({
  methods: ['GET', 'POST'],
  origin: (origin, done) => {
    if (origin && !CORS_WHITELIST.includes(origin))
      return done(new ForbiddenError('Blocked by CORS'))
    done(null, true)
  },
  credentials: true
})
