import { env } from './env'
import { app } from './app'

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
