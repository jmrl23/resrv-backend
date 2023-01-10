/* eslint-disable indent */
import jwt from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'
import { Router } from 'express'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { db } from '../services'
import { BadRequestError, InternalServerError } from 'express-response-errors'
import {
  JWT_SECRET,
  CLIENT_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  ORGANIZATION_EMAIL_DOMAIN,
  PASSPORT_GOOGLE_CALLBACK_URL,
  BYPASS_ORGANIZATION_EMAIL_FILTER_ON_DEVELOPMENT,
  NODE_ENV
} from '../configurations'
import passport from 'passport'

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: PASSPORT_GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']
    },
    async (_accessToken, _refreshToken, profile, next) => {
      const data: typeof profile._json = profile._json
      if (
        (NODE_ENV !== 'development' &&
          !data.email?.endsWith(`@${ORGANIZATION_EMAIL_DOMAIN}`)) ||
        (NODE_ENV === 'development' &&
          !BYPASS_ORGANIZATION_EMAIL_FILTER_ON_DEVELOPMENT &&
          !data.email?.endsWith(`@${ORGANIZATION_EMAIL_DOMAIN}`))
      )
        return next(null, undefined)
      try {
        const user = await db.user.findUnique({
          where: { email: data.email },
          include: { UserLevel: true }
        })
        if (user && user.enabled && !user?.UserLevel) {
          await db.user.update({
            where: { id: user.id },
            data: {
              userLevelId: await db.userLevel
                .create({ data: { email: data.email as string } })
                .then(({ id }) => id)
            }
          })
        }
        if (user) return next(null, user.id)
        const userLevel = await db.userLevel.findUnique({
          where: { email: data.email }
        })
        const newUser = await db.user.create({
          data: {
            email: data.email as string,
            givenName: data.given_name,
            familyName: data.family_name,
            displayName: data.name,
            picture: data.picture,
            userLevelId: userLevel
              ? userLevel.id
              : await db.userLevel
                  .create({ data: { email: data.email as string } })
                  .then(({ id }) => id)
          }
        })
        next(null, newUser.id)
      } catch (error: unknown) {
        if (error instanceof Error) next(new InternalServerError(error.message))
      }
    }
  )
)

const controller = Router()

controller

  .get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account',
      session: false
    })
  )

  .get(
    '/google/redirect',
    function (request: Request, response: Response, next: NextFunction) {
      passport.authenticate('google', { session: false }, function (error, id) {
        if (error) return next(new BadRequestError(error.message))
        if (!id) return response.redirect(`${CLIENT_URL}sign-in?error=1`)
        const token = jwt.sign({ id }, JWT_SECRET, {
          expiresIn: '30d'
        })
        response.redirect(`${CLIENT_URL}sign-in?token=${token}`)
      })(request, response, next)
    }
  )

export { controller }
