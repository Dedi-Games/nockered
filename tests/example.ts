import test from 'ava'

import { DockerAPI } from '../src/DockerAPI.js'

test('something', (t) => {
  const api = new DockerAPI('')
  t.notThrows(() => api.makeACall())
})
