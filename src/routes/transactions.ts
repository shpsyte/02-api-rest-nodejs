import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import z from 'zod'
import crypto from 'node:crypto'
export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')
    return { transactions }
  })

  app.get('/:id', async (req) => {
    const parShcema = z.object({
      id: z.string().uuid(),
    })
    const { id } = parShcema.parse(req.params)
    const transaction = await knex('transactions')
      .select('*')
      .where({ id })
      .first()
    return { transaction }
  })
  app.get('/summary', async () => {
    const summary = await knex('transactions')
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

    await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        amount: type === 'debit' ? -amount : amount,
        title,
      })
      .returning('*')

    return res.code(201).send()
  })
}
