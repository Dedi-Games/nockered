import ava, { ExecutionContext, TestFn } from 'ava'
import { Container } from '../../src/core/Container.js'
import { Exec } from '../../src/core/Exec.js'
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

test('static create()', async (t) => {
  const container = await createContainer('exec-create', undefined, t)
  await Container.start({ id: container.Id })
  const resp = await Exec.create(
    { id: container.Id },
    {
      Cmd: ['/bin/bash', '-c', 'echo "Hello, world!" > test.txt']
    }
  )
  t.is(typeof resp.Id, 'string')
})

test('static start()', async (t) => {
  const container = await createContainer('exec-start', undefined, t)
  await Container.start({ id: container.Id })
  const resp = await Exec.create(
    { id: container.Id },
    {
      Cmd: ['/bin/bash', '-c', 'echo "Hello, world!" > test-exec-start.txt']
    }
  )
  await Exec.start({ id: resp.Id }, {})
  const changes = await Container.changes({ id: container.Id })
  t.true(Array.isArray(changes) && changes.some((c) => c.Path === '/test-exec-start.txt'))
})

test('static resize()', async (t) => {
  const container = await createContainer('exec-resize', undefined, t)
  await Container.start({ id: container.Id })
  const resp = await Exec.create(
    { id: container.Id },
    {
      Cmd: ['/bin/bash'],
      Tty: true
    }
  )
  await Exec.start({ id: resp.Id }, { Detach: true, Tty: true })
  await Exec.resize({ id: resp.Id }, { h: 10, w: 20 })
  t.pass()
})

test('static inspect()', async (t) => {
  const container = await createContainer('exec-inspect', undefined, t)
  await Container.start({ id: container.Id })
  const exec = await Exec.create(
    { id: container.Id },
    {
      Cmd: ['/bin/bash', '-c', 'echo "Hello, world!" > test-exec-inspect.txt']
    }
  )
  const resp = await Exec.inspect({ id: exec.Id })
  t.is(typeof resp.ID, 'string')
})