import test from 'ava'
import { DockerEngineAPIFactory } from '../../src/common/DockerEngineAPI.js'

test('DockerEngineAPI > create() with version v1.41', (t) => {
  const docker = DockerEngineAPIFactory.create({
    version: 'v1.41',
    prefixUrl: 'unix:/var/run/docker.sock/v1.41/'
  })

  t.is(docker.getVersion(), 'v1.41')
  t.is(
    docker.getGotInstance().defaults.options.prefixUrl,
    'unix:/var/run/docker.sock/v1.41/'
  )
})
