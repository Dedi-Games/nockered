import test from 'ava'
import { DockerEngineAPIFactory } from '../../src/common/DockerEngineAPI.js'

test('DockerEngineAPI > create() with version v1.42', (t) => {
  const docker = DockerEngineAPIFactory.create({
    version: 'v1.42',
    prefixUrl: 'unix:/var/run/docker.sock/v1.42/'
  })

  t.is(docker.getVersion(), 'v1.42')
  t.is(
    docker.getGotInstance().defaults.options.prefixUrl,
    'unix:/var/run/docker.sock/v1.42/'
  )
})
