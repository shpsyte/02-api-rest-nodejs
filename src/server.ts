import fastify from 'fastify'
import { knex } from './database'
import crypto from 'node:crypto'

const app = fastify()

app.get('/hello', async (request, reply) => {
  const transaction = await knex('transactions')
    .select('id', 'title')
    .orderBy('id', 'desc')

  return transaction
})

app
  .listen({
    port: Number(process.env.PORT) || 3333,
    host: 'localhost',
  })
  .then((address) => {
    console.log(`🦊 Server listening at: ${address}`)
  })
  .catch((err) => {
    console.error(err)
  })
