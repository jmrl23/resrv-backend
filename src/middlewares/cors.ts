import type { Request } from 'express'
import e from 'cors'
import { CLIENT_URL } from '../configurations'

export const cors = e<Request>({
  methods: ['GET', 'POST'],
  origin: CLIENT_URL.replace(/\/+$/, '')
})
