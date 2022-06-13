import ava, { TestFn } from 'ava'
import InstanceManager from '../src/InstanceManager.js'
import { TestExecutionContext } from '../src/types/TestExecutionContext.js'

const test = ava as TestFn<TestExecutionContext>

test('static getInstance() without having set one', async (t) => {
  const instance = InstanceManager.getInstance()
  t.true(instance instanceof Object)
})
