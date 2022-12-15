import { Prisma } from '@prisma/client'

export type User =
  | Prisma.UserGetPayload<{
      include: {
        UserLevel: true
        StudentInformation: true
      }
    }>
  | undefined
