import ava, { TestFn } from 'ava'
import { NodeAPI } from '../../src/api/NodeAPI.js'
import { Node } from '../../src/core/Node.js'
import { Swarm } from '../../src/core/Swarm.js'
import DockerAPI from '../../src/index.js'
import { TestExecutionContext } from '../../src/types/TestExecutionContext.js'
import { RequestError } from 'got'

const test = ava as TestFn<TestExecutionContext>

test.before(async (t) => {
  t.context.DockerAPI = new DockerAPI('http://localhost:2375')
  return await Swarm.init({
    ListenAddr: '0.0.0.0:2377'
  })
})

test.after.always(async (t) => {
  t.context.DockerAPI = new DockerAPI('http://localhost:2375')
  await Swarm.leave({ force: true })
})

test.beforeEach((t) => {
  t.context.DockerAPI = new DockerAPI('unix:/var/run/docker.sock:/v1.41')
})

test('static inspect()', async (t) => {
  const resp = await Swarm.inspect()
  t.is(typeof resp.ID, 'string')
})

test('static join()', async (t) => {
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

test.serial('static update()', async (t) => {
  const swarm = await Swarm.inspect()
  await Swarm.update(
    { version: swarm.Version.Index, rotateManagerToken: true },
    {}
  )
  const updatedSwarm = await Swarm.inspect()
  t.not(swarm.JoinTokens.Manager, updatedSwarm.JoinTokens.Manager)
})

test.serial('static unlockKey()', async (t) => {
  const swarm = await Swarm.inspect()
  await Swarm.update(
    { version: swarm.Version.Index },
    { EncryptionConfig: { AutoLockManagers: true } }
  )
  const resp = await Swarm.unlockKey()
  t.true(resp.UnlockKey !== '')
})

test.serial('static unlock()', async (t) => {
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

test('static node-list()', async (t) => {
  const resp = await Node.list()
  t.true(Array.isArray(resp))
})

test('static node-inspect()', async (t) => {
  const node = await Node.list()
  if (node[0]) {
    const resp = await Node.inspect({ id: node[0].ID })
    t.is(typeof resp.ID, 'string')
  }
})

test('static node-delete()', async (t) => {
  const node = await Node.list()
  await t.throwsAsync(async () => {
    if (node[0]) {
      await Node.delete({ id: node[0].ID })
    }
  })
})

test.serial('static node-update()', async (t) => {
  const node = await Node.list()
  if (node[0]) {
    await Node.update(
      { id: node[0].ID },
      { version: node[0].Version.Index },
      { Role: 'manager', Availability: 'pause' }
    )
    const resp = await Node.inspect({ id: node[0].ID })
    t.is(resp.Spec.Availability, 'pause')
  }
})

test('static nodeApi-list()', async (t) => {
  const resp = await NodeAPI.list()
  t.true(resp[0] instanceof Node)
})

test('static nodeApi-get()', async (t) => {
  const node = await NodeAPI.list()
  if (node[0]) {
    const resp = await NodeAPI.get(node[0].ID)
    t.is(typeof resp.ID, 'string')
  }
})

test('node-inspect()', async (t) => {
  const node = await NodeAPI.list()
  if (node[0]) {
    const resp = await node[0].inspect()
    t.is(typeof resp.ID, 'string')
  }
})

test('node-delete()', async (t) => {
  const node = await NodeAPI.list()
  await t.throwsAsync(async () => {
    if (node[0]) {
      await node[0].delete()
    }
  })
})

test.serial('node-update()', async (t) => {
  const node = await NodeAPI.list()
  if (node[0] && node[0].Version.Index) {
    await node[0].update(
      { version: node[0].Version.Index },
      { Role: 'manager', Availability: 'pause' }
    )
    const resp = await node[0].inspect()
    t.is(resp.Spec.Availability, 'pause')
  }
})
