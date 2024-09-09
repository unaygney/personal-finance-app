import { Redis } from '@upstash/redis'

const getRedisUrlAndToken = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    throw new Error('REDIS_URL and REDIS_TOKEN are required')
  }
  return { url, token }
}

export const redis = new Redis(getRedisUrlAndToken())
