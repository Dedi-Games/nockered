import ava, { TestFn } from 'ava'

import { DockerAPI } from '../../src'
import { TestExecutionContext } from '../../src/types/TestExecutionContext'

const test = ava as TestFn<TestExecutionContext>

test.beforeEach((t) => {
  t.context.DockerAPI = new DockerAPI('unix:/var/run/docker.sock:/v1.41')
})

test('checkAuthConfiguration()', async (t) => {
  const resp = await t.context.DockerAPI.system.checkAuthConfiguration({
    username: 'hannibal',
    password: 'xxxx',
    serveraddress: 'http://localhost:5000/'
  })
  t.is(typeof resp.Status, 'string')
})

test('getSystemInformation()', async (t) => {
  const resp = await t.context.DockerAPI.system.getSystemInformation()
  t.is(typeof resp.ID, 'string')
})

test('getVersion()', async (t) => {
  const resp = await t.context.DockerAPI.system.getVersion()
  t.is(typeof resp.Version, 'string')
})

test('ping()', async (t) => {
  const resp = await t.context.DockerAPI.system.ping()
  t.is(typeof resp, 'string')
})

test('ping() with method', async (t) => {
  const resp = await t.context.DockerAPI.system.ping('head')
  t.is(typeof resp, 'string')
})

test('monitorEvents()', async (t) => {
  const resp = await t.context.DockerAPI.system.monitorEvents()
  t.true(resp.readable)
  resp.destroy()
  t.false(resp.readable)
})

test('monitorEvents() with query', async (t) => {
  const since = new Date()
  const until = new Date(since)
  until.setMinutes(since.getMinutes() + 1)
  const resp = await t.context.DockerAPI.system.monitorEvents({
    since: since.toString(),
    until: until.toString(),
    filters: 'type=container'
  })
  t.true(resp.readable)
  resp.destroy()
  t.false(resp.readable)
})

test('getDataUsageInformation()', async (t) => {
  const resp = await t.context.DockerAPI.system.getDataUsageInformation()
  t.is(typeof resp.LayersSize, 'number')
})
