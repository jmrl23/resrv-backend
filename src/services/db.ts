import { PrismaClient } from '@prisma/client'
import { NODE_ENV } from '../configurations'

export const db = new PrismaClient({
  log: NODE_ENV === 'development' ? ['query', 'warn', 'error'] : undefined
})

export const dbLog = async (userId: string | undefined, message: string) => {
  if (!message) return
  try {
    const { id } = await db.log.create({
      data: { userId, message }
    })
    return id
  } catch (error) {
    if (error instanceof Error) return
  }
}
