import ava, { TestFn } from 'ava'

import { DockerAPI } from '../src'
import { TestExecutionContext } from '../src/types/TestExecutionContext'

const test = ava as TestFn<TestExecutionContext>

test.beforeEach((t) => {
  t.context.DockerAPI = new DockerAPI('unix:/var/run/docker.sock:/v1.41')
})

test('listContainers()', async (t) => {
  const resp = await t.context.DockerAPI.containers.listContainers()
  t.true(Array.isArray(resp))
})

test('listContainers() with params', async (t) => {
  const resp = await t.context.DockerAPI.containers.listContainers({
    all: true,
    filters: '{"status": ["running"]}',
    limit: 3,
    size: true
  })
  t.true(Array.isArray(resp))
})
