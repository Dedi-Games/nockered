import ava, { ExecutionContext, TestFn } from 'ava'
import { Volume } from '../../src/core/Volume.js'
import DockerAPI from '../../src/index.js'
import { TestExecutionContext } from '../../src/types/TestExecutionContext.js'
import { GetParamType } from '../../src/utils/GetParamType.js'

const test = ava as TestFn<TestExecutionContext>

const createVolume = async (
  name: string,
  body?: GetParamType<'VolumeCreate'>['body']['volumeConfig'],
  t?: ExecutionContext<TestExecutionContext>
) => {
  t?.teardown(() => Volume.delete({ name }, { force: true }))
  return await Volume.create(
    {
        Name: name,
        ...body
    }
  )
}

test.beforeEach((t) => {
  t.context.DockerAPI = new DockerAPI('unix:/var/run/docker.sock:/v1.41')
})

test('static list()', async (t) => {
  const resp = await Volume.list()
  t.true(Array.isArray(resp.Volumes))
})

test('static create()', async (t) => {
  const resp = await createVolume('volume-create', undefined, t)
  t.is(typeof resp.Name, 'string')
})

test('static inspect()', async (t) => {
  const resp = await createVolume('volume-inspect', undefined, t)
  const inspect = await Volume.inspect({ name: resp.Name })
  t.is(typeof inspect.Name, 'string')
})

test('static delete()', async (t) => {
  const resp = await createVolume('volume-delete', undefined)
  await Volume.delete({ name: resp.Name })
  const volumes = await Volume.list()
  t.false(volumes.Volumes.some((v) => v.Name === resp.Name))
})

test('static prune()', async (t) => {
  await createVolume('volume-prune', {
    Labels: {
      pruneTest: 'true'
    }
  })
  const prune = await Volume.prune({
    filters: JSON.stringify({ label: ['pruneTest'] })
  })
  t.true(
    Array.isArray(prune.VolumesDeleted) &&
    prune.VolumesDeleted.length === 1
  )
})