import ava, { TestFn } from 'ava'

import { DockerAPI } from '../src'
import { System } from '../src/endpoints/System'
import { TestExecutionContext } from '../src/types/TestExecutionContext'

const test = ava as TestFn<TestExecutionContext>

test.beforeEach((t) => {
  t.context.DockerAPI = new DockerAPI('unix:/var/run/docker.sock:/v1.41')
})

test('checkAuthConfiguration()', async (t) => {
  const resp = await System.checkAuthConfiguration({
    username: 'hannibal',
    password: 'xxxx',
    serveraddress: 'http://localhost:5000/'
  })
  t.is(typeof resp.Status, 'string')
})

test('getSystemInformation()', async (t) => {
  const resp = await System.getSystemInformation()
  t.is(typeof resp.ID, 'string')
})

test('getVersion()', async (t) => {
  const resp = await System.getVersion()
  t.is(typeof resp.Version, 'string')
})

test('ping()', async (t) => {
  const resp = await System.ping()
  t.is(typeof resp, 'string')
})

test('ping() with method', async (t) => {
  const resp = await System.ping('head')
  t.is(typeof resp, 'string')
})

test('monitorEvents()', async (t) => {
  const resp = await System.monitorEvents()
  t.true(resp.readable)
  resp.destroy()
  t.false(resp.readable)
})

test('monitorEvents() with query', async (t) => {
  const since = new Date()
  const until = new Date(since)
  until.setMinutes(since.getMinutes() + 1)
  const resp = await System.monitorEvents({
    since: since.toString(),
    until: until.toString(),
    filters: 'type=container'
  })
  t.true(resp.readable)
  resp.destroy()
  t.false(resp.readable)
})

test('getDataUsageInformation()', async (t) => {
  const resp = await System.getDataUsageInformation()
  t.is(typeof resp.LayersSize, 'number')
})