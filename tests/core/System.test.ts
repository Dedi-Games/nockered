import ava, { TestFn } from 'ava'

import { DockerAPI } from '../../src/index.js'
import { System } from '../../src/core/System.js'
import { TestExecutionContext } from '../../src/types/TestExecutionContext.js'

const test = ava as TestFn<TestExecutionContext>

test.beforeEach((t) => {
  t.context.DockerAPI = new DockerAPI('unix:/var/run/docker.sock:/v1.41')
})

test('static checkAuthConfiguration()', async (t) => {
  const resp = await System.checkAuthConfiguration({
    username: 'hannibal',
    password: 'xxxx',
    serveraddress: 'http://localhost:5000/'
  })
  t.is(typeof resp.Status, 'string')
})

test('static getSystemInformation()', async (t) => {
  const resp = await System.getSystemInformation()
  t.is(typeof resp.ID, 'string')
})

test('static getVersion()', async (t) => {
  const resp = await System.getVersion()
  t.is(typeof resp.Version, 'string')
})

test('static getPing()', async (t) => {
  const resp = await System.getPing()
  t.is(typeof resp, 'string')
})

test('static headPing()', async (t) => {
  const resp = await System.headPing()
  t.is(typeof resp, 'string')
})

test('static monitorEvents()', async (t) => {
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

test('static getDataUsageInformation()', async (t) => {
  const resp = await System.getDataUsageInformation()
  t.is(typeof resp.LayersSize, 'number')
})
