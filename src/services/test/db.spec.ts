import { join } from 'path'
import { config } from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

describe('db service', () => {
  beforeAll(async () => {
    config({
      path: join(__dirname, '../../../sandbox/.env.local')
    })
  })

  it('get the number programs saved in database', async () => {
    const { db } = await import('../db.service')
    expect(typeof (await db.program.count({ where: {} }))).toBe('number')
  })

  it('save a log', async () => {
    const { db, dbLog } = await import('../db.service')
    const id = await dbLog(undefined, `test - ${uuidv4()}`)
    expect(typeof id).toBe('string')
    await db.log.delete({ where: { id } })
  })
})
