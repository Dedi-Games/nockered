import { Options } from 'got'
import { BaseContainer } from './core/BaseContainer.js'
import { ContainerAPI } from './api/ContainerAPI.js'

interface DockerEngineAPIV141APIEndpoints {
  API: {
    Container: ContainerAPI
  }
}

interface DockerEngineAPIV141Endpoints {
  Container: BaseContainer
}

export class DockerEngineV141
  implements DockerEngineAPIV141APIEndpoints, DockerEngineAPIV141Endpoints
{
  /**
   * API Endpoints
   */
  API: {
    Container: ContainerAPI
  }

  /**
   * Endpoints
   */
  Container: BaseContainer

  constructor(options: Pick<Options, 'prefixUrl'>) {
    this.API = {} as DockerEngineAPIV141APIEndpoints['API']

    this.API.Container = new ContainerAPI(options)
    this.Container = new BaseContainer(options)
  }
}
