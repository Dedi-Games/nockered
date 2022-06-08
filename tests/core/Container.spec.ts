import ava, { TestFn } from 'ava'

import DockerAPI from '../../src/index.js'
import { Container } from '../../src/core/Container.js'
import { TestExecutionContext } from '../../src/types/TestExecutionContext.js'

const test = ava as TestFn<TestExecutionContext>

test.beforeEach((t) => {
  t.context.DockerAPI = new DockerAPI('unix:/var/run/docker.sock:/v1.41')
})

test('list()', async (t) => {
  const resp = await Container.list()
  t.true(Array.isArray(resp))
})

test('list() with params', async (t) => {
  const resp = await Container.list({
    all: true,
    filters: JSON.stringify({ status: ['running'] }),
    limit: 3,
    size: true
  })
  t.true(Array.isArray(resp))
})
