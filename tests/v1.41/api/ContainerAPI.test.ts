import ava, { TestFn } from 'ava'
import { DockerEngineFactory } from '../../../src/index.js'
import {
  createAndDeleteContainer,
  TestExecutionContext
} from '../../TestExecutionContext.js'

const test = ava as TestFn<TestExecutionContext>

test.beforeEach((t) => {
  t.context.DockerEngine = DockerEngineFactory.create({
    version: 'v1.41',
    prefixUrl: 'unix:/var/run/docker.sock:/v1.41'
  })
})

test('ContainerAPI > list()', async (t) => {
  const { DockerEngine } = t.context

  await createAndDeleteContainer(
    t,
    'containerapi-list',
    {
      Image: 'ubuntu'
    },
    true
  )

  const containers = await DockerEngine.API.Container.list({ all: true })

  t.true(Array.isArray(containers))
})
