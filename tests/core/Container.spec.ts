import ava, { ExecutionContext, TestFn } from 'ava'

import DockerAPI from '../../src/index.js'
import { Container } from '../../src/core/Container.js'
import { TestExecutionContext } from '../../src/types/TestExecutionContext.js'
import { GetParamType } from '../../src/utils/GetParamType.js'

const test = ava as TestFn<TestExecutionContext>

const createContainer = async (
  t: ExecutionContext<TestExecutionContext>,
  name: string,
  body?: GetParamType<'ContainerCreate'>['body']['body']
) => {
  t.teardown(() => Container.remove({ id: name }, { force: true }))
  return await Container.create(
    { name },
    {
      Image: 'ubuntu',
      OpenStdin: true,
      ...body
    }
  )
}

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

test('create()', async (t) => {
  const resp = await createContainer(t, 'container-create')
  t.is(typeof resp.Id, 'string')
})

test('inspect()', async (t) => {
  const resp = await createContainer(t, 'container-inspect')
  const inspect = await Container.inspect({ id: resp.Id })
  t.is(typeof inspect.Id, 'string')
})

test('top()', async (t) => {
  const resp = await createContainer(t, 'container-top')
  await Container.start({ id: resp.Id })
  const top = await Container.top({ id: resp.Id })
  t.is(typeof top.Processes, 'object')
})

test('logs()', async (t) => {
  const resp = await createContainer(t, 'container-logs')
  const logs = await Container.logs({ id: resp.Id })
  t.true(logs.readable)
  logs.destroy()
  t.false(logs.readable)
})

test('changes()', async (t) => {
  const resp = await createContainer(t, 'container-changes', {
    Cmd: ['/bin/bash', '-c', 'echo "Hello, world!" > test.txt']
  })
  await Container.start({ id: resp.Id })
  const changes = await Container.changes({ id: resp.Id })
  t.true(Array.isArray(changes))
})

test('export()', async (t) => {
  t.timeout(60000)
  const resp = await createContainer(t, 'container-export')
  const tarball = await Container.export({ id: resp.Id })
  t.true(tarball.readable)
  tarball.destroy()
  t.false(tarball.readable)
})

test('stats()', async (t) => {
  const resp = await createContainer(t, 'container-stats')
  await Container.start({ id: resp.Id })
  const stats = await Container.stats(
    { id: resp.Id },
    { stream: false, 'one-shot': true }
  )
  t.true(stats.readable)
  stats.destroy()
  t.false(stats.readable)
})
