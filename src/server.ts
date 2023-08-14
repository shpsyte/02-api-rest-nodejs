import fastify from 'fastify'

const app = fastify()

app.get('/hello', async (request, reply) => {
  return 'Hello world\n'
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
