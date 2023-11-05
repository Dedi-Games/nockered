import test from 'ava'
import { DockerEngineFactory } from '../../src/index.js'

test('DockerEngineAPI > create() with unsupported version', (t) => {
  t.throws(() =>
    DockerEngineFactory.create({
      version: 'v0.0' as any,
      prefixUrl: 'unix:/var/run/docker.sock/v0.0/'
    })
  )
})
