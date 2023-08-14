import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import z from 'zod'
import crypto from 'node:crypto'
export async function transactionsRoutes(app: FastifyInstance) {
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
