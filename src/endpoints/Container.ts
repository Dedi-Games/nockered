import { jsonEndpoint } from '../DockerAPI.js'
import { definitions } from '../specs/v1.41.js'
import { GetParamType } from '../utils/GetParamType.js'
import { GetResponseType } from '../utils/GetResponseType.js'
import { AbstractEndpoint } from './AbstractEndpoint'

export type ContainerSummary = definitions['ContainerSummary']
type Mount = definitions['Mount']
type EndpointSettings = definitions['EndpointSettings']
type Port = definitions['Port']

export class Container extends AbstractEndpoint<ContainerSummary> {
  public Command!: string
  public Created!: number
  public HostConfig!: { NetworkMode?: string }
  public Id!: string
  public Image!: string
  public ImageID!: string
  public Labels!: { [p: string]: string }
  public Mounts!: Mount[]
  public Names!: string[]
  public NetworkSettings!: {
    Networks: { [p: string]: EndpointSettings }
  }
  public Ports!: Port[]
  public SizeRootFs!: number
  public SizeRw!: number
  public State!: string
  public Status!: string

  /**
   * List containers
   * @description Returns a list of containers. For details on the format, see the inspect endpoint.
   */
  static async listContainers(query?: GetParamType<'ContainerList'>['query']) {
    const containers = await jsonEndpoint<
      GetResponseType<'ContainerList', 200>
    >('get', 'containers/json', { searchParams: query })
    return containers.map(
      (containerConfig) =>
        new Container(containerConfig as Required<ContainerSummary>)
    )
  }

  /**
   * Get container by ID
   * @param id Container ID
   */
  static async get(id: string) {
    const containers = await Container.listContainers({
      filters: JSON.stringify({ id: [id] })
    })
    return containers[0]
  }

  /**
   * Inspect a container
   * @description Return low-level information about a container.
   */
  inspect(query?: GetParamType<'ContainerInspect'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerInspect', 200>>(
      'get',
      `containers/${this.Id}/json`,
      {
        searchParams: query
      }
    )
  }

  /**
   * List processes running inside a container
   * @description On Unix systems, this is done by running the ps command. This endpoint is not supported on Windows.
   */
  top(query?: GetParamType<'ContainerTop'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerTop', 200>>(
      'get',
      `containers/${this.Id}/top`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Remove the container
   * TODO: Add test
   */
  delete(query?: GetParamType<'ContainerDelete'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerDelete', 204>>(
      'delete',
      `containers/${this.Id}`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Rename the container
   * TODO: Add test
   */
  rename(query?: GetParamType<'ContainerRename'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerRename', 204>>(
      'post',
      `containers/${this.Id}/rename`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Start the container
   * TODO: Add test
   */
  start(query?: GetParamType<'ContainerStart'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerStart', 204>>(
      'post',
      `containers/${this.Id}/start`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Stop the container
   * TODO: Add test
   */
  stop(query?: GetParamType<'ContainerStop'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerStop', 204>>(
      'post',
      `containers/${this.Id}/stop`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Kill the container
   * TODO: Add test
   */
  kill(query?: GetParamType<'ContainerKill'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerKill', 204>>(
      'post',
      `containers/${this.Id}/kill`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Pause the container
   * TODO: Add test
   */
  pause() {
    return jsonEndpoint<GetResponseType<'ContainerPause', 204>>(
      'post',
      `containers/${this.Id}/pause`
    )
  }

  /**
   * Wait the container
   * TODO: Add test
   */
  wait(query?: GetParamType<'ContainerWait'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerWait', 200>>(
      'post',
      `containers/${this.Id}/wait`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Unpause the container
   * TODO: Add test
   */
  unpause() {
    return jsonEndpoint<GetResponseType<'ContainerUnpause', 204>>(
      'post',
      `containers/${this.Id}/unpause`
    )
  }

  /**
   * Export the container
   * TODO: Add test
   */
  export() {
    return jsonEndpoint<GetResponseType<'ContainerExport', 200>>(
      'get',
      `containers/${this.Id}/export`
    )
  }
}
