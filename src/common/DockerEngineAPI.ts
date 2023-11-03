import { Options } from 'got'

import { DockerEngineAPIV141 } from '../v1.41/DockerEngineAPI.js'
import { DockerEngineAPIV142 } from '../v1.42/DockerEngineAPI.js'
import { DockerEngineAPIV143 } from '../v1.43/DockerEngineAPI.js'

export type DockerEngineAPIVersionsMap = {
  'v1.41': DockerEngineAPIV141
  'v1.42': DockerEngineAPIV142
  'v1.43': DockerEngineAPIV143
}

export class DockerEngineAPIFactory {
  static create<T extends keyof DockerEngineAPIVersionsMap>({
    version,
    ...gotOptions
  }: Pick<Options, 'prefixUrl'> & {
    version: T
  }): DockerEngineAPIVersionsMap[T] {
    switch (version) {
      case 'v1.41':
        return new DockerEngineAPIV141(
          gotOptions
        ) as DockerEngineAPIVersionsMap[T]
      case 'v1.42':
        return new DockerEngineAPIV142(
          gotOptions
        ) as DockerEngineAPIVersionsMap[T]
      case 'v1.43':
        return new DockerEngineAPIV143(
          gotOptions
        ) as DockerEngineAPIVersionsMap[T]
      default:
        throw new Error(
          `Version ${version} of the Docker Engine API is not supported by Nockered.`
        )
    }
  }
}
