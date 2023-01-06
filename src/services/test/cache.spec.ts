import { cached } from '../cache'

describe('cache service', () => {
  it('save something to cache and retrieve it', async () => {
    const message = 'Hello, World!'
    expect(await cached('test.message', () => message)).toBe(message)
  })
})
