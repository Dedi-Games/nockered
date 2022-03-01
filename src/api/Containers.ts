import { Container, ContainerSummary } from '../classes/Container.js'
import { jsonEndpoint } from '../DockerAPI.js'
import { GetParamType } from '../utils/GetParamType.js'
import { GetResponseType } from '../utils/GetResponseType.js'

export class Containers {
  async listContainers(query?: GetParamType<'ContainerList'>['query']) {
    const containers = await jsonEndpoint<
      GetResponseType<'ContainerList', 200>
    >('get', 'containers/json', { searchParams: query })
    return containers.map(
      (containerConfig) =>
        new Container(containerConfig as Required<ContainerSummary>)
    )
  }
}
