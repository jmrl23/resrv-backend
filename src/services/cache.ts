import { Cache } from 'memory-cache'

export const cache = new Cache<string, unknown>()

export async function cached(
  key: string,
  refresh: () => Promise<unknown> | unknown,
  ttl?: number,
  timeoutCallback?: (key: string, value: unknown) => void
) {
  try {
    const cachedData = await cache.get(key)
    if (cachedData) return cachedData
    const value = await refresh()
    await cache.put(key, value, ttl, timeoutCallback)
    return value
  } catch (error) {
    if (error instanceof Error) throw error
  }
}
