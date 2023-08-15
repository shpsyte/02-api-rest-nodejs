import fastify from 'fastify'
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

export { app }
