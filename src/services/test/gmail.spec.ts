import { join } from 'path'
import { config } from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

describe('db service', () => {
  beforeAll(async () => {
    config({
      path: join(__dirname, '../../../sandbox/.env.local')
    })
  })

  it('send an email', async () => {
    const { sendMail } = await import('../gmail.service')
    expect(
      sendMail({
        to: ['jojogaitera@gmail.com'],
        subject: 'Resrv | Test',
        text: `test - ${uuidv4()}`
      })
    ).toBeTruthy()
  })
})
