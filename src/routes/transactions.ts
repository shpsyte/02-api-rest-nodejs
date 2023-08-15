import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import z from 'zod'
import crypto from 'node:crypto'
import { checkSession } from '../middlewares/check-session-exists'
export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSession],
    },
    async (req) => {
      const { sessionId } = req.cookies
      const transactions = await knex('transactions')
        .where({ session_id: sessionId })
        .select('*')
      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSession],
    },
    async (req) => {
      const parShcema = z.object({
        id: z.string(),
      })
      const { id } = parShcema.parse(req.params)
      const { sessionId } = req.cookies
      const transaction = await knex('transactions')
        .where({
          session_id: sessionId,
          id,
        })
        .select('*')
        .first()

      return { transaction }
    },
  )

  app.get('/summary', async (req) => {
    const { sessionId } = req.cookies
    const summary = await knex('transactions')
      .where({ session_id: sessionId })
      .sum('amount', {
        as: 'total',
      })
      .first()

    return { summary }
  })

  app.post('/', async (req, res) => {
    const schema = z.object({
      amount: z.number(),
      title: z.string(),
      type: z.enum(['credit', 'debit']),
    })

    const { amount, title, type } = schema.parse(req.body)
    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = crypto.randomUUID()

      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        amount: type === 'debit' ? amount * -1 : amount,
        title,
        session_id: sessionId,
      })
      .returning('*')

    return res.code(201).send()
  })
}
