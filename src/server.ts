import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/hello', async (request, reply) => {
  const tables = knex('sqlite_schema').select('*')
  return tables
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
