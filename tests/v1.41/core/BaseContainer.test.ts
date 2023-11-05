import ava, { TestFn } from 'ava'
// import { Request } from 'got'
import { PassThrough } from 'stream'
import { pipeline } from 'stream/promises'
import { DockerEngineFactory } from '../../../src/index.js'
import {
  createAndDeleteContainer,
  TestExecutionContext
} from '../../TestExecutionContext.js'

const test = ava as TestFn<TestExecutionContext>

test.beforeEach((t) => {
  t.context.DockerEngine = DockerEngineFactory.create({
    version: 'v1.41',
    prefixUrl: 'unix:/var/run/docker.sock:/v1.41'
  })
})

test('BaseContainer > list()', async (t) => {
  const { DockerEngine } = t.context

  const containers = await DockerEngine.Container.list({ all: true })

  if (containers.success) {
    t.true(Array.isArray(containers.data))
    return
  }

  t.fail(containers.error)
})

test('BaseContainer > inspect()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(t, 'container-inspect', {
    Image: 'ubuntu'
  })

  const inspect = await DockerEngine.Container.inspect({
    id: container.Id
  })

  if (!inspect.success) {
    t.fail(inspect.error)
    throw new Error(inspect.error)
  }

  t.is(inspect.data.Id, container.Id)
})

test('BaseContainer > listProcesses()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-processes',
    {
      Image: 'ubuntu'
    },
    true
  )

  const processes = await DockerEngine.Container.listProcesses({
    id: container.Id
  })

  if (!processes.success) {
    t.fail(processes.error)
    throw new Error(processes.error)
  }

  t.true(Array.isArray(processes.data.Processes))
})

test('BaseContainer > logs()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-logs',
    {
      Image: 'hello-world'
    },
    true
  )

  const logs = await DockerEngine.Container.logs(
    {
      id: container.Id
    },
    {
      stdout: true
    }
  )

  if (!logs.success) {
    t.fail(logs.error)
    throw new Error(logs.error)
  }

  t.true(logs.data.includes('Hello from Docker!'))
})

test('BaseContainer > logsStream()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-logs-stream',
    {
      Image: 'hello-world'
    },
    true
  )

  const logs = DockerEngine.Container.logsStream(
    {
      id: container.Id
    },
    {
      stdout: true
    }
  )

  let data = ''
  const passThrough = new PassThrough()

  passThrough.on('data', (chunk) => {
    data += chunk.toString()
  })

  await pipeline(logs, passThrough)

  t.true(data.includes('Hello from Docker!'))
})

test('BaseContainer > changes()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-changes',
    {
      Image: 'ubuntu',
      Cmd: ['touch', 'changes.txt']
    },
    true
  )

  const changes = await DockerEngine.Container.changes({
    id: container.Id
  })

  if (!changes.success) {
    t.fail(changes.error)
    throw new Error(changes.error)
  }

  t.true(Array.isArray(changes.data))
})

test('BaseContainer > export()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-export',
    {
      Image: 'ubuntu',
      Cmd: ['touch', 'export.txt']
    },
    true
  )

  const exportStream = DockerEngine.Container.export({
    id: container.Id
  })

  let data = ''
  const passThrough = new PassThrough()

  passThrough.on('data', (chunk) => {
    data += chunk.toString()
  })

  await pipeline(exportStream, passThrough)
  t.true(data.includes('export.txt'))
})

test('BaseContainer > stats()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-stats',
    {
      Image: 'ubuntu'
    },
    true
  )

  const stats = await DockerEngine.Container.stats({
    id: container.Id
  })

  if (!stats.success) {
    t.fail(stats.error)
    throw new Error(stats.error)
  }

  t.is(stats.data['id'], container.Id)
})

test('BaseContainer > statsStream()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-stats-stream',
    {
      Image: 'ubuntu'
    },
    true
  )

  const stats = DockerEngine.Container.statsStream({
    id: container.Id
  })

  let data = ''
  const passThrough = new PassThrough()

  passThrough.on('data', (chunk) => {
    data += chunk.toString()
  })

  const abortController = new AbortController()

  t.timeout(2000)
  const timeout = setTimeout(() => {
    abortController.abort()
  }, 1000)

  try {
    await pipeline(stats, passThrough, { signal: abortController.signal })
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      throw new Error((error as Error).message)
    }
  } finally {
    clearTimeout(timeout)
  }

  t.is(JSON.parse(data)['id'], container.Id)
})

test('BaseContainer > resize()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-resize',
    {
      Image: 'ubuntu'
    },
    true
  )

  const resize = await DockerEngine.Container.resize(
    {
      id: container.Id
    },
    {
      h: 100,
      w: 100
    }
  )

  if (!resize.success) {
    t.fail(resize.error)
    throw new Error(resize.error)
  }

  t.pass()
})

test('BaseContainer > stop()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-stop',
    {
      Image: 'ubuntu'
    },
    true
  )

  const stop = await DockerEngine.Container.stop({
    id: container.Id
  })

  if (!stop.success) {
    t.fail(stop.error)
    throw new Error(stop.error)
  }

  t.pass()
})

test('BaseContainer > restart()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-restart',
    {
      Image: 'ubuntu'
    },
    true
  )

  const restart = await DockerEngine.Container.restart({
    id: container.Id
  })

  if (!restart.success) {
    t.fail(restart.error)
    throw new Error(restart.error)
  }

  t.pass()
})

test('BaseContainer > kill()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-kill',
    {
      Image: 'ubuntu'
    },
    true
  )

  const kill = await DockerEngine.Container.kill({
    id: container.Id
  })

  if (!kill.success) {
    t.fail(kill.error)
    throw new Error(kill.error)
  }

  t.pass()
})

test('BaseContainer > update()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(t, 'container-update', {
    Image: 'ubuntu'
  })

  const update = await DockerEngine.Container.update(
    {
      id: container.Id
    },
    {
      RestartPolicy: {
        Name: 'unless-stopped'
      }
    }
  )

  if (!update.success) {
    t.fail(update.error)
    throw new Error(update.error)
  }

  t.pass()
})

test('BaseContainer > rename()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(t, 'container-rename', {
    Image: 'ubuntu'
  })

  const rename = await DockerEngine.Container.rename(
    {
      id: container.Id
    },
    {
      name: 'container-renamed'
    }
  )

  if (!rename.success) {
    t.fail(rename.error)
    throw new Error(rename.error)
  }

  const rerename = await DockerEngine.Container.rename(
    {
      id: container.Id
    },
    {
      name: 'container-rename'
    }
  )

  if (!rerename.success) {
    t.fail(rerename.error)
    throw new Error(rerename.error)
  }

  t.pass()
})

test('BaseContainer > pause()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-pause',
    {
      Image: 'ubuntu'
    },
    true
  )

  const pause = await DockerEngine.Container.pause({
    id: container.Id
  })

  if (!pause.success) {
    t.fail(pause.error)
    throw new Error(pause.error)
  }

  t.pass()
})

test('BaseContainer > unpause()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-unpause',
    {
      Image: 'ubuntu'
    },
    true
  )

  const pause = await DockerEngine.Container.pause({
    id: container.Id
  })

  if (!pause.success) {
    t.fail(pause.error)
    throw new Error(pause.error)
  }

  const unpause = await DockerEngine.Container.unpause({
    id: container.Id
  })

  if (!unpause.success) {
    t.fail(unpause.error)
    throw new Error(unpause.error)
  }

  t.pass()
})

// test('BaseContainer > attach()', async (t) => {
//   const { DockerEngine } = t.context
//
//   const container = await createAndDeleteContainer(
//     t,
//     'container-attach',
//     {
//       Image: 'ubuntu',
//       Cmd: ['tail', '-f', '/dev/null'],
//       AttachStdin: true,
//       AttachStdout: true,
//       AttachStderr: true,
//       Tty: true,
//       OpenStdin: true
//     },
//     true
//   )
//
//   const attach = DockerEngine.Container.attach(
//     {
//       id: container.Id
//     },
//     {
//       stdin: true,
//       stdout: true,
//       stderr: true,
//       stream: true,
//       logs: true
//     }
//   )
//
//   let data = ''
//   const passThrough = new PassThrough()
//
//   passThrough.on('data', (chunk) => {
//     data += chunk.toString()
//   })
//
//   attach.pipe(passThrough)
//
//   const writeStream = (stream: Request, chunk: string) =>
//     new Promise((resolve: Function) => {
//       stream.write(chunk, 'utf-8', () => resolve())
//     })
//
//   await writeStream(attach, 'echo "Hello from attachStream!"\n')
//
//   await new Promise((resolve) => setTimeout(resolve, 1000))
//
//   console.log(data)
//   t.true(data.includes('root'))
// })

test('BaseContainer > wait()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(t, 'container-wait', {
    Image: 'ubuntu'
  })

  const stop = await DockerEngine.Container.stop({
    id: container.Id
  })

  if (!stop.success) {
    t.fail(stop.error)
    throw new Error(stop.error)
  }

  const wait = await DockerEngine.Container.wait({
    id: container.Id
  })

  if (!wait.success) {
    t.fail(wait.error)
    throw new Error(wait.error)
  }

  t.is(wait.data.StatusCode, 0)
})

test('BaseContainer > archive()', async (t) => {
  const { DockerEngine } = t.context

  const container = await createAndDeleteContainer(
    t,
    'container-archive',
    {
      Image: 'ubuntu',
      Cmd: ['touch', 'archive.txt']
    },
    true
  )

  const archive = DockerEngine.Container.archive(
    {
      id: container.Id
    },
    {
      path: 'archive.txt'
    }
  )

  let data = ''
  const passThrough = new PassThrough()

  passThrough.on('data', (chunk) => {
    data += chunk.toString()
  })

  const abortController = new AbortController()

  t.timeout(2000)
  const timeout = setTimeout(() => {
    abortController.abort()
  }, 1000)

  try {
    await pipeline(archive, passThrough, { signal: abortController.signal })
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      throw new Error((error as Error).message)
    }
  } finally {
    clearTimeout(timeout)
  }

  t.true(data.includes('archive.txt'))
})

test('BaseContainer > prune()', async (t) => {
  const { DockerEngine } = t.context

  const container = await DockerEngine.Container.create(
    {
      name: 'container-prune'
    },
    {
      Image: 'ubuntu'
    }
  )

  if (!container.success) {
    t.fail(container.error)
    throw new Error(container.error)
  }

  const prune = await DockerEngine.Container.prune()

  if (!prune.success) {
    t.fail(prune.error)
    throw new Error(prune.error)
  }

  t.true(Array.isArray(prune.data.ContainersDeleted))
  t.true(prune.data.ContainersDeleted.includes(container.data.Id))
})
