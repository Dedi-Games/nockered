import { ExecutionContext } from 'ava'
import { BodyParams } from '../src/utils/BodyParams.js'
import { DeepRequired } from '../src/utils/DeepRequired.js'
import { ResponseType } from '../src/utils/ResponseType.js'
import { DockerEngineV141 } from '../src/v1.41/DockerEngine.js'
import { operations } from '../src/v1.41/specs.js'

export interface TestExecutionContext {
  DockerEngine: DockerEngineV141
}

export async function createAndDeleteContainer(
  t: ExecutionContext<TestExecutionContext>,
  name: string,
  body: BodyParams<operations['ContainerCreate']>['body'],
  start: boolean = false
): Promise<DeepRequired<ResponseType<operations['ContainerCreate'], 201>>> {
  const { DockerEngine } = t.context

  t.teardown(async () => {
    const deleted = await DockerEngine.Container.delete(
      { id: name },
      { force: true }
    )
    if (!deleted.success) {
      t.fail(deleted.error)
    }
  })

  const container = await DockerEngine.Container.create(
    { name },
    {
      Image: 'ubuntu',
      OpenStdin: true,
      ...body
    }
  )

  if (!container.success) {
    t.fail(container.error)
    throw new Error(container.error)
  }

  if (start) {
    const started = await DockerEngine.Container.start({ id: name })
    if (!started.success) {
      t.fail(started.error)
      throw new Error(started.error)
    }
  }

  return container.data
}
