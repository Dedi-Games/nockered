import { jsonEndpoint, streamEndpoint } from '../DockerAPI.js'
import { definitions } from '../specs/v1.41.js'
import { GetParamType } from '../utils/GetParamType.js'
import { GetResponseType } from '../utils/GetResponseType.js'
import { AbstractEndpoint } from './AbstractEndpoint.js'

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
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerList
   */
  static list(query?: GetParamType<'ContainerList'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerList', 200>>(
      'get',
      'containers/json',
      { searchParams: query }
    )
  }

  /**
   * Create a container
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerCreate
   */
  static create(
    query: GetParamType<'ContainerCreate'>['query'],
    body: GetParamType<'ContainerCreate'>['body']['body']
  ) {
    return jsonEndpoint<GetResponseType<'ContainerCreate', 201>>(
      'post',
      'containers/create',
      {
        searchParams: query,
        json: body
      }
    )
  }

  /**
   * Inspect a container
   * @description Returns low-level information about a container.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerInspect
   */
  static inspect(
    path: GetParamType<'ContainerInspect'>['path'],
    query?: GetParamType<'ContainerInspect'>['query']
  ) {
    return jsonEndpoint<GetResponseType<'ContainerInspect', 200>>(
      'get',
      `containers/${path.id}/json`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Inspect a container
   * @description Return low-level information about a container.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerInspect
   */
  inspect(query?: GetParamType<'ContainerInspect'>['query']) {
    return Container.inspect({ id: this.Id }, query)
  }

  /**
   * List processes running inside a container
   * @description On Unix systems, this is done by running the ps command. This endpoint is not supported on Windows.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerTop
   */
  static top(
    path: GetParamType<'ContainerTop'>['path'],
    query?: GetParamType<'ContainerTop'>['query']
  ) {
    return jsonEndpoint<GetResponseType<'ContainerTop', 200>>(
      'get',
      `containers/${path.id}/top`,
      {
        searchParams: query
      }
    )
  }

  /**
   * List processes running inside a container
   * @description On Unix systems, this is done by running the ps command. This endpoint is not supported on Windows.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerTop
   */
  top(query?: GetParamType<'ContainerTop'>['query']) {
    return Container.top({ id: this.Id }, query)
  }

  /**
   * Get container logs
   * @description Returns the logs of a container.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerLogs
   */
  static logs(
    path: GetParamType<'ContainerLogs'>['path'],
    query?: GetParamType<'ContainerLogs'>['query']
  ) {
    return streamEndpoint('get', `containers/${path.id}/logs`, {
      searchParams: query
    })
  }

  /**
   * Get container logs
   * @description Returns the logs of a container.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerLogs
   */
  logs(query?: GetParamType<'ContainerLogs'>['query']) {
    return Container.logs({ id: this.Id }, query)
  }

  /**
   * Get changes on a container’s filesystem
   * @description Returns which files in a container's filesystem have been added, deleted, or modified. The Kind of modification can be one of:
   * - 0: Modified
   * - 1: Added
   * - 2: Deleted
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerChanges
   */
  static changes(path: GetParamType<'ContainerChanges'>['path']) {
    return jsonEndpoint<GetResponseType<'ContainerChanges', 200>>(
      'get',
      `containers/${path.id}/changes`
    )
  }

  /**
   * Get changes on a container’s filesystem
   * @description Returns which files in a container's filesystem have been added, deleted, or modified. The Kind of modification can be one of:
   * - 0: Modified
   * - 1: Added
   * - 2: Deleted
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerChanges
   */
  changes() {
    return Container.changes({ id: this.Id })
  }

  /**
   * Export a container
   * @description Export the contents of a container as a tarball.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerExport
   */
  static export(path: GetParamType<'ContainerExport'>['path']) {
    return streamEndpoint<GetResponseType<'ContainerExport', 200>>(
      'get',
      `containers/${path.id}/export`
    )
  }

  /**
   * Export a container
   * @description Export the contents of a container as a tarball.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerExport
   */
  export() {
    return Container.export({ id: this.Id })
  }

  /**
   * Get container stats based on resource usage
   * @description This endpoint returns a live stream of a container’s resource usage statistics.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerStats
   */
  static stats(
    path: GetParamType<'ContainerStats'>['path'],
    query?: GetParamType<'ContainerStats'>['query']
  ) {
    return streamEndpoint<GetResponseType<'ContainerStats', 200>>(
      'get',
      `containers/${path.id}/stats`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Get container stats based on resource usage
   * @description This endpoint returns a live stream of a container’s resource usage statistics.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerStats
   */
  stats(query?: GetParamType<'ContainerStats'>['query']) {
    return Container.stats({ id: this.Id }, query)
  }

  /**
   * Resize a container TTY
   * @description Resize the TTY for a container.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerResize
   */
  static resize(
    path: GetParamType<'ContainerResize'>['path'],
    query?: GetParamType<'ContainerResize'>['query']
  ) {
    return jsonEndpoint<GetResponseType<'ContainerResize', 200>>(
      'post',
      `containers/${path.id}/resize`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Resize a container TTY
   * @description Resize the TTY for a container.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerResize
   */
  resize(query?: GetParamType<'ContainerResize'>['query']) {
    return Container.resize({ id: this.Id }, query)
  }

  /**
   * Start a container
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerStart
   */
  static start(
    path: GetParamType<'ContainerStart'>['path'],
    query?: GetParamType<'ContainerStart'>['query']
  ) {
    return jsonEndpoint<GetResponseType<'ContainerStart', 204>>(
      'post',
      `containers/${path.id}/start`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Start a container
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerStart
   */
  start(query?: GetParamType<'ContainerStart'>['query']) {
    return Container.start({ id: this.Id }, query)
  }

  /**
   * Stop a container
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerStop
   */
  static stop(
    path: GetParamType<'ContainerStop'>['path'],
    query?: GetParamType<'ContainerStop'>['query']
  ) {
    return jsonEndpoint<GetResponseType<'ContainerStop', 204>>(
      'post',
      `containers/${path.id}/stop`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Stop a container
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerStop
   */
  stop(query?: GetParamType<'ContainerStop'>['query']) {
    return Container.stop({ id: this.Id }, query)
  }

  /**
   * Restart a container
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerRestart
   */
  static restart(
    path: GetParamType<'ContainerRestart'>['path'],
    query?: GetParamType<'ContainerRestart'>['query']
  ) {
    return jsonEndpoint<GetResponseType<'ContainerRestart', 204>>(
      'post',
      `containers/${path.id}/restart`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Restart a container
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerRestart
   */
  restart(query?: GetParamType<'ContainerRestart'>['query']) {
    return Container.restart({ id: this.Id }, query)
  }

  /**
   * Kill a container
   * @description Send a POSIX signal to a container, defaulting to killing to the container.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerKill
   */
  static kill(
    path: GetParamType<'ContainerKill'>['path'],
    query?: GetParamType<'ContainerKill'>['query']
  ) {
    return jsonEndpoint<GetResponseType<'ContainerKill', 204>>(
      'post',
      `containers/${path.id}/kill`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Kill a container
   * @description Send a POSIX signal to a container, defaulting to killing to the container.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerKill
   */
  kill(query?: GetParamType<'ContainerKill'>['query']) {
    return Container.kill({ id: this.Id }, query)
  }

  /**
   * Update a container
   * @description Change various configuration options of a container without having to recreate it.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerUpdate
   */
  static update(
    path: GetParamType<'ContainerUpdate'>['path'],
    body?: GetParamType<'ContainerUpdate'>['body']['update']
  ) {
    return jsonEndpoint<GetResponseType<'ContainerUpdate', 200>>(
      'post',
      `containers/${path.id}/update`,
      {
        json: body
      }
    )
  }

  /**
   * Update a container
   * @description Change various configuration options of a container without having to recreate it.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerUpdate
   */
  update(body?: GetParamType<'ContainerUpdate'>['body']['update']) {
    return Container.update({ id: this.Id }, body)
  }

  /**
   * Rename a container
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerRename
   */
  static rename(
    path: GetParamType<'ContainerRename'>['path'],
    query?: GetParamType<'ContainerRename'>['query']
  ) {
    return jsonEndpoint<GetResponseType<'ContainerRename', 204>>(
      'post',
      `containers/${path.id}/rename`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Rename a container
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerRename
   */
  rename(query?: GetParamType<'ContainerRename'>['query']) {
    return Container.rename({ id: this.Id }, query)
  }

  /**
   * Pause a container
   * @description Use the freezer cgroup to suspend all processes in a container.
   * Traditionally, when suspending a process the SIGSTOP signal is used, which is observable by the process being suspended.
   * With the freezer cgroup the process is unaware, and unable to capture, that it is being suspended, and subsequently resumed.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerPause
   */
  static pause(path: GetParamType<'ContainerPause'>['path']) {
    return jsonEndpoint<GetResponseType<'ContainerPause', 204>>(
      'post',
      `containers/${path.id}/pause`
    )
  }

  /**
   * Pause a container
   * @description Use the freezer cgroup to suspend all processes in a container.
   * Traditionally, when suspending a process the SIGSTOP signal is used, which is observable by the process being suspended.
   * With the freezer cgroup the process is unaware, and unable to capture, that it is being suspended, and subsequently resumed.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerPause
   */
  pause() {
    return Container.pause({ id: this.Id })
  }

  /**
   * Unpause a container
   * @description Resume a container which has been paused.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerUnpause
   */
  static unpause(path: GetParamType<'ContainerUnpause'>['path']) {
    return jsonEndpoint<GetResponseType<'ContainerUnpause', 204>>(
      'post',
      `containers/${path.id}/unpause`
    )
  }

  /**
   * Unpause a container
   * @description Resume a container which has been paused.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerUnpause
   */
  unpause() {
    return Container.unpause({ id: this.Id })
  }

  /**
   * Wait for a container
   * @description Block until a container stops, then returns the exit code.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerWait
   */
  static wait(path: GetParamType<'ContainerWait'>['path']) {
    return jsonEndpoint<GetResponseType<'ContainerWait', 200>>(
      'post',
      `containers/${path.id}/wait`
    )
  }

  /**
   * Wait for a container
   * @description Block until a container stops, then returns the exit code.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerWait
   */
  wait() {
    return Container.wait({ id: this.Id })
  }

  /**
   * Remove a container
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerRemove
   */
  static delete(
    path: GetParamType<'ContainerDelete'>['path'],
    query?: GetParamType<'ContainerDelete'>['query']
  ) {
    return jsonEndpoint<GetResponseType<'ContainerDelete', 204>>(
      'delete',
      `containers/${path.id}`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Remove a container
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerRemove
   */
  delete(query?: GetParamType<'ContainerDelete'>['query']) {
    return Container.delete({ id: this.Id }, query)
  }

  /**
   * Get an archive of a filesystem resource in a container
   * @description Get a tar archive of a resource in the filesystem of container id.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerArchive
   */
  static archive(
    path: GetParamType<'ContainerArchive'>['path'],
    query?: GetParamType<'ContainerArchive'>['query']
  ) {
    return streamEndpoint<GetResponseType<'ContainerArchive', 200>>(
      'get',
      `containers/${path.id}/archive`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Get an archive of a filesystem resource in a container
   * @description Get a tar archive of a resource in the filesystem of container id.
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerArchive
   */
  archive(query?: GetParamType<'ContainerArchive'>['query']) {
    return Container.archive({ id: this.Id }, query)
  }

  /**
   * Delete stopped containers
   * @link https://docs.docker.com/engine/api/v1.41/#operation/ContainerPrune
   */
  static prune(query?: GetParamType<'ContainerPrune'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerPrune', 200>>(
      'post',
      `containers/prune`,
      {
        searchParams: query
      }
    )
  }
}
