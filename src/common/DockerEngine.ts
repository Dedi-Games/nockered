import { DockerEngineV141 } from '../v1.41/DockerEngine.js'

type DockerEngineAPIVersionsMap = {
  'v1.41': DockerEngineV141
}

export class DockerEngineFactory {
  static create<T extends keyof DockerEngineAPIVersionsMap>({
    version,
    ...gotOptions
  }: {
    version: T
    prefixUrl: string
  }): DockerEngineAPIVersionsMap[T] {
    switch (version) {
      case 'v1.41':
        return new DockerEngineV141(gotOptions) as DockerEngineAPIVersionsMap[T]
      default:
        throw new Error(
          `Version ${version} of the Docker Engine API is not supported by Nockered.`
        )
    }
  }
}
