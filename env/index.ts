import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.number().default(3333),
  DATABASE_URL: z.string().min(2),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables')
}

if (_env.data.NODE_ENV === 'development') {
  console.log('Environment variables', JSON.stringify(_env.data, null, 2))
}

export const env = _env.data
