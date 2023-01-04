import { Cache } from 'memory-cache'

export const cache = new Cache<string, unknown>()

export async function cached<T>(
  key: string,
  refresh: () => Promise<unknown> | unknown,
  ttl?: number,
  timeoutCallback?: (key: string, value: unknown) => void
): Promise<T | undefined> {
  try {
    const cachedData = (await cache.get(key)) as T
    if (cachedData) return cachedData
    const value = await refresh()
    await cache.put(key, value, ttl, timeoutCallback)
    return value as T
  } catch (error) {
    if (error instanceof Error) throw error
  }
}
