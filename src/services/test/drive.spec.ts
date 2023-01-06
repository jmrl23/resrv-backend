import { join } from 'path'
import { config } from 'dotenv'

describe('db service', () => {
  beforeAll(async () => {
    config({
      path: join(__dirname, '../../../sandbox/.env.local')
    })
  })

  it('save file to drive', async () => {
    const { driveUpload } = await import('../drive')
    expect(
      await driveUpload(join(__dirname, '../../../sandbox/api/300x300.png'))
    ).toBeTruthy()
  })
})
