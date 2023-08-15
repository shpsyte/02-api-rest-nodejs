import fastify from 'fastify'
import { env } from '../env'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'
const app = fastify()

app.register(cookie)

app.addHook('preHandler', async (req, reply) => {
  console.log(`logging a global hook =>  ${req.url} ${req.method}`)
})

app.register(transactionsRoutes, {
  prefix: '/transact',
})

app
  .listen({
    port: env.PORT || 3333,
    host: 'localhost',
  })
  .then((address) => {
    console.log(`🦊 Server listening at: ${address}`)
  })
  .catch((err) => {
    console.error(err)
  })
