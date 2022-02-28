import { jsonEndpoint } from '../DockerAPI.js'
import { GetParamType } from '../utils/GetParamType.js'
import { GetResponseType } from '../utils/GetResponseType.js'

export class Containers {
  listContainers(query?: GetParamType<'ContainerList'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerList', 200>>(
      'get',
      'containers/json',
      { searchParams: query }
    )
  }
}
