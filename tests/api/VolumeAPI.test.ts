import ava, { ExecutionContext, TestFn } from 'ava'
import { VolumeAPI } from '../../src/api/VolumeAPI.js'
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
  return await VolumeAPI.create(
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
  const resp = await VolumeAPI.list()
  t.true(resp[0] instanceof Volume)
})

test('static create()', async (t) => {
  const resp = await createVolume('volumeapi-create', undefined, t)
  t.true(resp instanceof Volume)
})

test('static get()', async (t) => {
  const createdVolume = await createVolume('volumeapi-get', undefined, t)
  const resp = await VolumeAPI.get(createdVolume.Name)
  t.true(resp instanceof Volume)
})

test('inspect()', async (t) => {
  const createdVolume = await createVolume('volumeapi-inspect', undefined, t)
  const resp = await createdVolume.inspect()
  t.is(typeof resp.Name, 'string')
})

test('delete()', async (t) => {
  const createdVolume = await createVolume('volumeapi-delete', undefined)
  await createdVolume.delete()
  const volume = await Volume.list()
  t.false(volume.Volumes.some((v) => v.Name === createdVolume.Name))
})