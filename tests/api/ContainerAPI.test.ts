import ava, { ExecutionContext, TestFn } from 'ava'
import { ContainerAPI } from '../../src/api/ContainerAPI.js'
import { Container } from '../../src/core/Container.js'
import DockerAPI from '../../src/index.js'
import { TestExecutionContext } from '../../src/types/TestExecutionContext.js'
import { GetParamType } from '../../src/utils/GetParamType.js'

const test = ava as TestFn<TestExecutionContext>

const createContainer = async (
  name: string,
  body?: GetParamType<'ContainerCreate'>['body']['body'],
  t?: ExecutionContext<TestExecutionContext>
) => {
  t?.teardown(() => Container.delete({ id: name }, { force: true }))
  return await ContainerAPI.create(
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
  const resp = await ContainerAPI.list()
  t.true(resp[0] instanceof Container)
})

test('static create()', async (t) => {
  const resp = await createContainer('containerapi-create', undefined, t)
  t.true(resp instanceof Container)
})

test('static get()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-get',
    undefined,
    t
  )
  const resp = await ContainerAPI.get(createdContainer.Id)
  t.true(resp instanceof Container)
})

test('inspect()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-inspect',
    undefined,
    t
  )
  const inspect = await createdContainer.inspect()
  t.is(typeof inspect.Id, 'string')
})

test('top()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-top',
    undefined,
    t
  )
  await createdContainer.start()
  const top = await createdContainer.top()
  t.is(typeof top.Processes, 'object')
})

test('logs()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-logs',
    undefined,
    t
  )
  const logs = createdContainer.logs()
  t.true(logs.readable)
  logs.destroy()
  t.false(logs.readable)
})

test('changes()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-changes',
    {
      Cmd: ['/bin/bash', '-c', 'echo "Hello, world!" > test.txt']
    },
    t
  )
  await createdContainer.start()
  const changes = await createdContainer.changes()
  t.true(Array.isArray(changes))
})

test('export()', async (t) => {
  t.timeout(60000)
  const createdContainer = await createContainer(
    'containerapi-export',
    undefined,
    t
  )
  const tarball = await createdContainer.export()
  t.true(tarball.readable)
  tarball.destroy()
  t.false(tarball.readable)
})

test('stats()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-stats',
    undefined,
    t
  )
  await createdContainer.start()
  const stats = await createdContainer.stats({
    stream: false,
    'one-shot': true
  })
  t.true(stats.readable)
  stats.destroy()
  t.false(stats.readable)
})

test('resize()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-resize',
    undefined,
    t
  )
  await createdContainer.start()
  await createdContainer.resize({ h: 10, w: 20 })
  t.pass()
})

test('restart()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-restart',
    undefined,
    t
  )
  await createdContainer.start()
  await createdContainer.restart({ t: 0 })
  const inspect = await createdContainer.inspect()
  t.is(inspect.State?.Status, 'running')
})

test('kill()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-kill',
    undefined,
    t
  )
  await createdContainer.start()
  await createdContainer.kill({ signal: 'SIGKILL' })
  const inspect = await createdContainer.inspect()
  t.is(inspect.State?.Status, 'exited')
})

test('update()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-update',
    undefined,
    t
  )
  const update = await createdContainer.update({
    RestartPolicy: { Name: 'on-failure' }
  })
  /**
   * @exception
   * Warnings property should be either string[] or undefined based on Docker documentation
   * but is null instead of undefined.
   */
  t.not(typeof update.Warnings, 'undefined')
})

test('rename()', async (t) => {
  const newName = 'containerapi-new-name'
  const createdContainer = await createContainer(
    'containerapi-rename',
    undefined,
    t
  )
  await createdContainer.rename({ name: newName })
  const inspect = await createdContainer.inspect()
  t.is(inspect.Name, '/' + newName)
  await createdContainer.rename({ name: 'containerapi-rename' })
})

test('pause()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-pause',
    undefined,
    t
  )
  await createdContainer.start()
  await createdContainer.pause()
  const inspect = await createdContainer.inspect()
  t.is(inspect.State?.Status, 'paused')
})

test('unpause()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-unpause',
    undefined,
    t
  )
  await createdContainer.start()
  await createdContainer.pause()
  await createdContainer.unpause()
  const inspect = await createdContainer.inspect()
  t.is(inspect.State?.Status, 'running')
})

test('wait()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-wait',
    undefined,
    t
  )
  await createdContainer.start()
  createdContainer.stop({ t: 1 })
  const wait = await createdContainer.wait()
  t.is(typeof wait.StatusCode, 'number')
})

test('delete()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-delete',
    undefined
  )
  await createdContainer.delete()
  const containers = await Container.list()
  t.false(containers.some((c) => c.Id === createdContainer.Id))
})

test('archive()', async (t) => {
  const createdContainer = await createContainer(
    'containerapi-archive',
    {
      Cmd: ['/bin/bash', '-c', 'echo "Hello, world!" > test.txt']
    },
    t
  )
  await createdContainer.start()
  const tarball = await createdContainer.archive({ path: 'test.txt' })
  t.true(tarball.readable)
  tarball.destroy()
  t.false(tarball.readable)
})
