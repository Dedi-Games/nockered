import test from 'ava'
import { DockerEngineAPIFactory } from '../../src/common/DockerEngineAPI.js'

test('DockerEngineAPI > create() with unsupported version', (t) => {
  t.throws(() =>
    DockerEngineAPIFactory.create({
      version: 'v0.0' as any,
      prefixUrl: 'unix:/var/run/docker.sock/v0.0/'
    })
  )
})
