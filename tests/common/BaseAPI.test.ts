import test from 'ava'
import { BaseAPI } from '../../src/common/BaseAPI.js'
import { Options } from 'got'

class MockBaseAPI extends BaseAPI {
  constructor(options: Pick<Options, 'prefixUrl'>) {
    super(options)
  }

  nonExistentJSONEndpoint() {
    return this.jsonEndpoint('get', 'non-existent-endpoint')
  }

  nonExistentTextEndpoint() {
    return this.textEndpoint('get', 'non-existent-endpoint')
  }
}

test('BaseAPI > jsonEndpoint() with unsupported path', async (t) => {
  const DockerEngine = new MockBaseAPI({
    prefixUrl: 'unix:/var/run/docker.sock/v1.41/'
  })

  const response = await DockerEngine.nonExistentJSONEndpoint()

  t.false(response.success)
})

test('BaseAPI > textEndpoint() with unsupported path', async (t) => {
  const DockerEngine = new MockBaseAPI({
    prefixUrl: 'unix:/var/run/docker.sock/v1.41/'
  })

  const response = await DockerEngine.nonExistentTextEndpoint()

  t.false(response.success)
})
