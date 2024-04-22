import { LRUCache } from 'lru-cache'
import { makeApiCallQueued } from './apiQueue'

const options = {
  max: 250,
  ttl: 1000 * 60 * 15
}
const cache = new LRUCache(options)

export const makeApiCall = async (request: string, chainId: number) => {
  const key = `${chainId}${request}`
  const cachedResponse = cache.get(key)

  if (cachedResponse) {
    return cachedResponse
  }

  const response = await makeApiCallQueued(request, chainId)
  if (
    response.status === '1' ||
    response.result == 'Missing contract addresses'
  ) {
    cache.set(key, response)
  }

  return response
}
