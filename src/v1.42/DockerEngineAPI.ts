import { Options } from 'got'
import { BaseDockerEngineAPI } from '../common/BaseDockerEngineAPI.js'

export class DockerEngineAPIV142 extends BaseDockerEngineAPI {
  #version: 'v1.42' = 'v1.42'

  constructor(options: Pick<Options, 'prefixUrl'>) {
    super(options)
  }

  getVersion() {
    return this.#version
  }
}
