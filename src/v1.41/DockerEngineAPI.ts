import { Options } from 'got'
import { BaseDockerEngineAPI } from '../common/BaseDockerEngineAPI.js'

export class DockerEngineAPIV141 extends BaseDockerEngineAPI {
  #version: 'v1.41' = 'v1.41'

  constructor(options: Pick<Options, 'prefixUrl'>) {
    super(options)
  }

  getVersion() {
    return this.#version
  }
}
