import ava, { ExecutionContext, TestFn } from 'ava'

import DockerAPI from '../../src/index.js'
import { Container } from '../../src/core/Container.js'
import { TestExecutionContext } from '../../src/types/TestExecutionContext.js'
import { GetParamType } from '../../src/utils/GetParamType.js'

const test = ava as TestFn<TestExecutionContext>

const createContainer = async (
  name: string,
  body?: GetParamType<'ContainerCreate'>['body']['body'],
  t?: ExecutionContext<TestExecutionContext>
) => {
  t?.teardown(() => Container.delete({ id: name }, { force: true }))
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

test('static list()', async (t) => {
  const resp = await Container.list({
    all: true,
    filters: JSON.stringify({ status: ['running'] }),
    limit: 3,
    size: true
  })
  t.true(Array.isArray(resp))
})

test('static create()', async (t) => {
  const resp = await createContainer('container-create', undefined, t)
  t.is(typeof resp.Id, 'string')
})

test('static inspect()', async (t) => {
  const resp = await createContainer('container-inspect', undefined, t)
  const inspect = await Container.inspect({ id: resp.Id })
  t.is(typeof inspect.Id, 'string')
})

test('static top()', async (t) => {
  const resp = await createContainer('container-top', undefined, t)
  await Container.start({ id: resp.Id })
  const top = await Container.top({ id: resp.Id })
  t.is(typeof top.Processes, 'object')
})

test('static logs()', async (t) => {
  const resp = await createContainer('container-logs', undefined, t)
  const logs = Container.logs({ id: resp.Id })
  t.true(logs.readable)
  logs.destroy()
  t.false(logs.readable)
})

test('static changes()', async (t) => {
  const resp = await createContainer(
    'container-changes',
    {
      Cmd: ['/bin/bash', '-c', 'echo "Hello, world!" > test.txt']
    },
    t
  )
  await Container.start({ id: resp.Id })
  const changes = await Container.changes({ id: resp.Id })
  t.true(Array.isArray(changes))
})

test('static export()', async (t) => {
  t.timeout(60000)
  const resp = await createContainer('container-export', undefined, t)
  const tarball = await Container.export({ id: resp.Id })
  t.true(tarball.readable)
  tarball.destroy()
  t.false(tarball.readable)
})

test('static stats()', async (t) => {
  const resp = await createContainer('container-stats', undefined, t)
  await Container.start({ id: resp.Id })
  const stats = await Container.stats(
    { id: resp.Id },
    { stream: false, 'one-shot': true }
  )
  t.true(stats.readable)
  stats.destroy()
  t.false(stats.readable)
})

test('static resize()', async (t) => {
  const resp = await createContainer('container-resize', undefined, t)
  await Container.start({ id: resp.Id })
  await Container.resize({ id: resp.Id }, { h: 10, w: 20 })
  t.pass()
})

test('static restart()', async (t) => {
  const resp = await createContainer('container-restart', undefined, t)
  await Container.start({ id: resp.Id })
  await Container.restart({ id: resp.Id }, { t: 0 })
  const inspect = await Container.inspect({ id: resp.Id })
  t.is(inspect.State?.Status, 'running')
})

test('static kill()', async (t) => {
  const resp = await createContainer('container-kill', undefined, t)
  await Container.start({ id: resp.Id })
  await Container.kill({ id: resp.Id }, { signal: 'SIGKILL' })
  const inspect = await Container.inspect({ id: resp.Id })
  t.is(inspect.State?.Status, 'exited')
})

test('static update()', async (t) => {
  const resp = await createContainer('container-update', undefined, t)
  const update = await Container.update(
    { id: resp.Id },
    { RestartPolicy: { Name: 'on-failure' } }
  )
  /**
   * @exception
   * Warnings property should be either string[] or undefined based on Docker documentation
   * but is null instead of undefined.
   */
  t.not(typeof update.Warnings, 'undefined')
})

test('static rename()', async (t) => {
  const newName = 'container-new-name'
  const resp = await createContainer('container-rename', undefined, t)
  await Container.rename({ id: resp.Id }, { name: newName })
  const inspect = await Container.inspect({ id: newName })
  t.is(inspect.Name, '/' + newName)
  await Container.rename({ id: newName }, { name: 'container-rename' })
})

test('static pause()', async (t) => {
  const resp = await createContainer('container-pause', undefined, t)
  await Container.start({ id: resp.Id })
  await Container.pause({ id: resp.Id })
  const inspect = await Container.inspect({ id: resp.Id })
  t.is(inspect.State?.Status, 'paused')
})

test('static unpause()', async (t) => {
  const resp = await createContainer('container-unpause', undefined, t)
  await Container.start({ id: resp.Id })
  await Container.pause({ id: resp.Id })
  await Container.unpause({ id: resp.Id })
  const inspect = await Container.inspect({ id: resp.Id })
  t.is(inspect.State?.Status, 'running')
})

test('static wait()', async (t) => {
  const resp = await createContainer('container-wait', undefined, t)
  await Container.start({ id: resp.Id })
  Container.stop({ id: resp.Id }, { t: 1 })
  const wait = await Container.wait({ id: resp.Id })
  t.is(typeof wait.StatusCode, 'number')
})

test('static delete()', async (t) => {
  const resp = await createContainer('container-delete', undefined)
  await Container.delete({ id: resp.Id })
  const containers = await Container.list()
  t.false(containers.some((c) => c.Id === resp.Id))
})

test('static archive()', async (t) => {
  const resp = await createContainer(
    'container-archive',
    {
      Cmd: ['/bin/bash', '-c', 'echo "Hello, world!" > test.txt']
    },
    t
  )
  await Container.start({ id: resp.Id })
  const tarball = await Container.archive({ id: resp.Id }, { path: 'test.txt' })
  t.true(tarball.readable)
  tarball.destroy()
  t.false(tarball.readable)
})

test('static prune()', async (t) => {
  const resp = await createContainer('container-prune', {
    Labels: {
      pruneTest: 'true'
    }
  })
  Container.stop({ id: resp.Id })
  await Container.wait({ id: resp.Id })
  const prune = await Container.prune({
    filters: JSON.stringify({ label: ['pruneTest'] })
  })
  t.true(
    Array.isArray(prune.ContainersDeleted) &&
      prune.ContainersDeleted.length === 1
  )
})
