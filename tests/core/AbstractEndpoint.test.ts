import ava, { TestFn } from 'ava'
import { AbstractEndpoint } from '../../src/core/AbstractEndpoint.js'
import { TestExecutionContext } from '../../src/types/TestExecutionContext.js'

const test = ava as TestFn<TestExecutionContext>

interface ITestEndpoint {
  id: string
}

class TestEndpoint extends AbstractEndpoint<ITestEndpoint> {
  public id!: string
}

test('AbstractEndpoint assigns properties dynamically', async (t) => {
  const id = 'TestEndpoint'
  const testClass = new TestEndpoint({ id })
  t.is(testClass.id, id)
})
