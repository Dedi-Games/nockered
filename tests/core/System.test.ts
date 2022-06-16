import ava, { TestFn } from 'ava'

import { DockerAPI } from '../../src/index.js'
import { System } from '../../src/core/System.js'
import { TestExecutionContext } from '../../src/types/TestExecutionContext.js'

const test = ava as TestFn<TestExecutionContext>

test.beforeEach((t) => {
  t.context.DockerAPI = new DockerAPI('unix:/var/run/docker.sock:/v1.41')
})

test('static auth()', async (t) => {
  const resp = await System.auth({
    username: 'hannibal',
    password: 'xxxx',
    serveraddress: 'http://localhost:5000/'
  })
  t.is(typeof resp.Status, 'string')
})

test('static systemInfo()', async (t) => {
  const resp = await System.systemInfo()
  t.is(typeof resp.ID, 'string')
})

test('static version()', async (t) => {
  const resp = await System.version()
  t.is(typeof resp.Version, 'string')
})

test('static ping()', async (t) => {
  const resp = await System.ping()
  t.is(typeof resp, 'string')
})

test('static pingHead()', async (t) => {
  const resp = await System.pingHead()
  t.is(typeof resp, 'string')
})

test('static events()', async (t) => {
  const since = new Date()
  const until = new Date(since)
  until.setMinutes(since.getMinutes() + 1)
  const resp = await System.events({
    since: since.toString(),
    until: until.toString(),
    filters: 'type=container'
  })
  t.true(resp.readable)
  resp.destroy()
  t.false(resp.readable)
})

test('static dataUsage()', async (t) => {
  const resp = await System.dataUsage()
  t.is(typeof resp.LayersSize, 'number')
})
