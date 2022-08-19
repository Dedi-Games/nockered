import ava, { ExecutionContext, TestFn } from 'ava'
import { Swarm } from '../../src/core/Swarm.js'
import DockerAPI from '../../src/index.js'
import { TestExecutionContext } from '../../src/types/TestExecutionContext.js'
import { RequestError } from 'got'

const test = ava as TestFn<TestExecutionContext>

const initializeSwarm = async (t?: ExecutionContext<TestExecutionContext>) => {
  t?.teardown(() => Swarm.leave({ force: true }))
  return await Swarm.init({
    ListenAddr: '0.0.0.0:2377'
  })
}

test.beforeEach((t) => {
  t.context.DockerAPI = new DockerAPI('unix:/var/run/docker.sock:/v1.41')
})

test.serial('static inspect()', async (t) => {
  await initializeSwarm(t)
  const resp = await Swarm.inspect()
  t.is(typeof resp.ID, 'string')
})

test.serial('static init()', async (t) => {
  const resp = await initializeSwarm(t)
  t.is(typeof resp, 'string')
})

test.serial('static join()', async (t) => {
  await initializeSwarm(t)
  await t.throwsAsync(
    async () => {
      await Swarm.join({
        ListenAddr: '0.0.0.0:2377'
      })
    },
    {
      instanceOf: RequestError,
      message: 'Response code 503 (Service Unavailable)'
    }
  )
})

test.serial('static leave()', async (t) => {
  await initializeSwarm()
  await Swarm.leave({ force: true })
  t.pass()
})

test.serial('static update()', async (t) => {
  await initializeSwarm(t)
  const swarm = await Swarm.inspect()
  await Swarm.update(
    { version: swarm.Version.Index, rotateManagerToken: true },
    {}
  )
  const updatedSwarm = await Swarm.inspect()
  t.not(swarm.JoinTokens.Manager, updatedSwarm.JoinTokens.Manager)
})

test.serial('static unlockKey()', async (t) => {
  await initializeSwarm(t)
  const swarm = await Swarm.inspect()
  await Swarm.update(
    { version: swarm.Version.Index },
    { EncryptionConfig: { AutoLockManagers: true } }
  )
  const resp = await Swarm.unlockKey()
  t.true(resp.UnlockKey !== '')
})

test.serial('static unlock()', async (t) => {
  await initializeSwarm(t)
  const swarm = await Swarm.inspect()
  await Swarm.update(
    { version: swarm.Version.Index, rotateManagerUnlockKey: true },
    { EncryptionConfig: { AutoLockManagers: true } }
  )
  const resp = await Swarm.unlockKey()
  await t.throwsAsync(
    async () => {
      await Swarm.unlock({ UnlockKey: resp.UnlockKey })
    },
    {
      instanceOf: RequestError,
      message: 'Response code 409 (Conflict)'
    }
  )
})
