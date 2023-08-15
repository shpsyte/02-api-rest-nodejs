"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const node_child_process_1 = require("node:child_process");
(0, vitest_1.describe)('app test', () => {
    const BASE_URL = '';
    const _server = {};
    const sessionId = '';
    (0, vitest_1.beforeAll)(async () => {
        // _server = app
        // await _server.listen()
        // const address = _server.server.address()
        // console.log(address)
        // if (typeof address === 'string') {
        //   BASE_URL = address
        // } else {
        //   BASE_URL = `http://${address?.address}:${address?.port}`
        // }
        await app_1.app.ready();
    });
    (0, vitest_1.afterAll)(async () => {
        await app_1.app.close();
    });
    (0, vitest_1.beforeEach)(async () => {
        (0, node_child_process_1.execSync)('npm run knex migrate:rollback --all');
        (0, node_child_process_1.execSync)('npm run knex migrate:latest');
    });
    (0, vitest_1.it)('should be able for user create a new transaction', async () => {
        const input = {
            title: 'test',
            amount: 100,
            type: 'credit',
        };
        const response = await (0, supertest_1.default)(app_1.app.server).post(`/transact`).send(input);
        (0, vitest_1.expect)(response.statusCode).toBe(201);
    });
    (0, vitest_1.it)('should be able to list all transactions', async () => {
        const input = {
            title: 'test create',
            amount: 5000,
            type: 'credit',
        };
        const responseCreate = await (0, supertest_1.default)(app_1.app.server)
            .post(`/transact`)
            .send(input);
        const cookies = responseCreate.headers['set-cookie'];
        const response = await (0, supertest_1.default)(app_1.app.server)
            .get(`/transact`)
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(response.body.transactions).toEqual([
            vitest_1.expect.objectContaining({
                amount: 5000,
                title: 'test create',
                id: vitest_1.expect.any(String),
                created_at: vitest_1.expect.any(String),
                session_id: vitest_1.expect.any(String),
            }),
        ]);
    });
    (0, vitest_1.it)('should be able to get a specfic transation', async () => {
        const input = {
            title: 'test create',
            amount: 5000,
            type: 'credit',
        };
        const responseCreate = await (0, supertest_1.default)(app_1.app.server)
            .post(`/transact`)
            .send(input);
        const cookies = responseCreate.headers['set-cookie'];
        const response = await (0, supertest_1.default)(app_1.app.server)
            .get(`/transact`)
            .set('Cookie', cookies)
            .expect(200);
        const transactionId = response.body.transactions[0].id;
        const transaction = await (0, supertest_1.default)(app_1.app.server)
            .get(`/transact/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(transaction.body.transaction).toEqual(vitest_1.expect.objectContaining({
            id: transactionId,
            title: vitest_1.expect.any(String),
        }));
    });
    (0, vitest_1.it)('should be able to get a summary', async () => {
        const creditRes = await (0, supertest_1.default)(app_1.app.server).post(`/transact`).send({
            title: 'test create',
            amount: 200,
            type: 'credit',
        });
        const cookies = creditRes.headers['set-cookie'];
        await (0, supertest_1.default)(app_1.app.server)
            .post(`/transact`)
            .send({
            title: 'test create',
            amount: 80,
            type: 'debit',
        })
            .set('Cookie', cookies);
        const summaryResponse = await (0, supertest_1.default)(app_1.app.server)
            .get(`/transact/summary`)
            .set('Cookie', cookies);
        const expectedValue = { summary: { total: 120 } };
        (0, vitest_1.expect)(summaryResponse.body, `
      expected: ${JSON.stringify(expectedValue)}
      got: ${JSON.stringify(summaryResponse.body)}
    `).toEqual(expectedValue);
    });
});
