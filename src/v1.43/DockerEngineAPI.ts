import { Options } from 'got'
import { BaseDockerEngineAPI } from '../common/BaseDockerEngineAPI.js'

export class DockerEngineAPIV143 extends BaseDockerEngineAPI {
  #version: 'v1.43' = 'v1.43'

  constructor(options: Pick<Options, 'prefixUrl'>) {
    super(options)
  }

  getVersion() {
    return this.#version
  }
}
