import ava, { TestFn } from 'ava'

import { DockerAPI } from '../src'
import { Container } from '../src/endpoints/Container'
import { TestExecutionContext } from '../src/types/TestExecutionContext'

const test = ava as TestFn<TestExecutionContext>

test.beforeEach((t) => {
  t.context.DockerAPI = new DockerAPI('unix:/var/run/docker.sock:/v1.41')
})

test('listContainers()', async (t) => {
  const resp = await Container.listContainers()
  t.true(Array.isArray(resp))
})

test('listContainers() with params', async (t) => {
  const resp = await Container.listContainers({
    all: true,
    filters: '{"status": ["running"]}',
    limit: 3,
    size: true
  })
  t.true(Array.isArray(resp))
})

test('get()', async (t) => {
  // TODO: Create container in before() hook and use its ID as param here
  const container = await Container.get('c8b993ce4aeca')
  t.true(container !== undefined)
})
