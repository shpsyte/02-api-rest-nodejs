import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { FastifyInstance } from 'fastify/types/instance'
import { execSync } from 'node:child_process'
describe('app test', () => {
  const BASE_URL = ''
  const _server = {} as FastifyInstance
  const sessionId = ''

  beforeAll(async () => {
    // _server = app
    // await _server.listen()
    // const address = _server.server.address()
    // console.log(address)
    // if (typeof address === 'string') {
    //   BASE_URL = address
    // } else {
    //   BASE_URL = `http://${address?.address}:${address?.port}`
    // }

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able for user create a new transaction', async () => {
    const input = {
      title: 'test',
      amount: 100,
      type: 'credit',
    }

    const response = await request(app.server).post(`/transact`).send(input)
    expect(response.statusCode).toBe(201)
  })

  it('should be able to list all transactions', async () => {
    const input = {
      title: 'test create',
      amount: 5000,
      type: 'credit',
    }

    const responseCreate = await request(app.server)
      .post(`/transact`)
      .send(input)

    const cookies = responseCreate.headers['set-cookie']

    const response = await request(app.server)
      .get(`/transact`)
      .set('Cookie', cookies)
      .expect(200)

    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        amount: 5000,
        title: 'test create',
        id: expect.any(String),
        created_at: expect.any(String),
        session_id: expect.any(String),
      }),
    ])
  })
})
