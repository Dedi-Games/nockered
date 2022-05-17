import ava, { TestFn } from 'ava'

import { DockerAPI } from '../../src'
import { Container } from '../../src/core/Container'
import { TestExecutionContext } from '../../src/types/TestExecutionContext'

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
