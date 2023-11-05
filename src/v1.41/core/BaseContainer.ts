import { Options } from 'got'
import { BodyParams } from '../../utils/BodyParams.js'
import { PathParams } from '../../utils/PathParams.js'
import { QueryParams } from '../../utils/QueryParams.js'
import { ResponseType } from '../../utils/ResponseType.js'
import { operations } from '../specs.js'
import { BaseAPI } from '../../common/BaseAPI.js'

export class BaseContainer extends BaseAPI {
  constructor(options: Pick<Options, 'prefixUrl'>) {
    super(options)
  }

  /**
   * List containers
   * @param query Query to filter containers
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerList
   */
  list(query?: QueryParams<operations['ContainerList']>) {
    return this.jsonEndpoint<ResponseType<operations['ContainerList'], 200>>(
      'get',
      'containers/json',
      {
        searchParams: query
      }
    )
  }

  /**
   * Create a container
   * @param query Query parameters to create a container
   * @param body Body parameters to create a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerCreate
   */
  create(
    query?: QueryParams<operations['ContainerCreate']>,
    body?: BodyParams<operations['ContainerCreate']>['body']
  ) {
    return this.jsonEndpoint<ResponseType<operations['ContainerCreate'], 201>>(
      'post',
      'containers/create',
      {
        searchParams: query,
        /**
         * @todo Follow this issue on GitHub.
         * Body should not be inside of a body property (Swagger type issue).
         * ['body'] type after BodyParams is a workaround.
         */
        json: body
      }
    )
  }

  /**
   * Inspect a container
   * @param path Path parameters to inspect a container
   * @param query Query parameters to inspect a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerInspect
   */
  inspect(
    path: PathParams<operations['ContainerInspect']>,
    query?: QueryParams<operations['ContainerInspect']>
  ) {
    return this.jsonEndpoint<ResponseType<operations['ContainerInspect'], 200>>(
      'get',
      `containers/${path.id}/json`,
      {
        searchParams: query
      }
    )
  }

  /**
   * List processes running inside a container
   * @param path Path parameters to list processes running inside a container
   * @param query Query parameters to list processes running inside a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerListProcesses
   */
  listProcesses(
    path: PathParams<operations['ContainerTop']>,
    query?: QueryParams<operations['ContainerTop']>
  ) {
    return this.jsonEndpoint<ResponseType<operations['ContainerTop'], 200>>(
      'get',
      `containers/${path.id}/top`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Get container logs
   * @param path Path parameters to get container logs
   * @param query Query parameters to get container logs
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerLogs
   */
  logs(
    path: PathParams<operations['ContainerLogs']>,
    query?: Omit<QueryParams<operations['ContainerLogs']>, 'follow'>
  ) {
    return this.textEndpoint('get', `containers/${path.id}/logs`, {
      searchParams: {
        ...query,
        follow: false
      }
    })
  }

  /**
   * Get container logs as a stream
   * @param path Path parameters to get container logs as a stream
   * @param query Query parameters to get container logs as a stream
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerLogs
   */
  logsStream(
    path: PathParams<operations['ContainerLogs']>,
    query?: Omit<QueryParams<operations['ContainerLogs']>, 'follow'>
  ) {
    return this.streamEndpoint('get', `containers/${path.id}/logs`, {
      searchParams: {
        ...query,
        follow: true
      }
    })
  }

  /**
   * Get changes on a container's filesystem
   * @param path Path parameters to get changes on a container's filesystem
   * @param query Query parameters to get changes on a container's filesystem
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerChanges
   */
  changes(
    path: PathParams<operations['ContainerChanges']>,
    query?: QueryParams<operations['ContainerChanges']>
  ) {
    return this.jsonEndpoint<ResponseType<operations['ContainerChanges'], 200>>(
      'get',
      `containers/${path.id}/changes`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Export a container
   * @param path Path parameters to export a container
   * @param query Query parameters to export a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerExport
   */
  export(
    path: PathParams<operations['ContainerExport']>,
    query?: QueryParams<operations['ContainerExport']>
  ) {
    return this.streamEndpoint('get', `containers/${path.id}/export`, {
      searchParams: query
    })
  }

  /**
   * Get container stats based on resource usage
   * @param path Path parameters to get container stats based on resource usage
   * @param query Query parameters to get container stats based on resource usage
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerStats
   */
  stats(
    path: PathParams<operations['ContainerStats']>,
    query?: Omit<QueryParams<operations['ContainerStats']>, 'stream'>
  ) {
    return this.jsonEndpoint<ResponseType<operations['ContainerStats'], 200>>(
      'get',
      `containers/${path.id}/stats`,
      {
        searchParams: {
          ...query,
          stream: false
        }
      }
    )
  }

  /**
   * Get container stats based on resource usage as a stream
   * @param path Path parameters to get container stats based on resource usage as a stream
   * @param query Query parameters to get container stats based on resource usage as a stream
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerStats
   */
  statsStream(
    path: PathParams<operations['ContainerStats']>,
    query?: Omit<QueryParams<operations['ContainerStats']>, 'stream'>
  ) {
    return this.streamEndpoint('get', `containers/${path.id}/stats`, {
      searchParams: {
        ...query,
        stream: true
      }
    })
  }

  /**
   * Resize a container TTY
   * @param path Path parameters to resize a container TTY
   * @param query Query parameters to resize a container TTY
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerResize
   */
  resize(
    path: PathParams<operations['ContainerResize']>,
    query: QueryParams<operations['ContainerResize']>
  ) {
    return this.jsonEndpoint('post', `containers/${path.id}/resize`, {
      searchParams: query
    })
  }

  /**
   * Start a container
   * @param path Path parameters to start a container
   * @param query Query parameters to start a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerStart
   */
  start(
    path: PathParams<operations['ContainerStart']>,
    query?: QueryParams<operations['ContainerStart']>
  ) {
    return this.jsonEndpoint<ResponseType<operations['ContainerStart'], 204>>(
      'post',
      `containers/${path.id}/start`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Stop a container
   * @param path Path parameters to stop a container
   * @param query Query parameters to stop a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerStop
   */
  stop(
    path: PathParams<operations['ContainerStop']>,
    query?: QueryParams<operations['ContainerStop']>
  ) {
    return this.jsonEndpoint<ResponseType<operations['ContainerStop'], 204>>(
      'post',
      `containers/${path.id}/stop`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Restart a container
   * @param path Path parameters to restart a container
   * @param query Query parameters to restart a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerRestart
   */
  restart(
    path: PathParams<operations['ContainerRestart']>,
    query?: QueryParams<operations['ContainerRestart']>
  ) {
    return this.jsonEndpoint<ResponseType<operations['ContainerRestart'], 204>>(
      'post',
      `containers/${path.id}/restart`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Kill a container
   * @param path Path parameters to kill a container
   * @param query Query parameters to kill a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerKill
   */
  kill(
    path: PathParams<operations['ContainerKill']>,
    query?: QueryParams<operations['ContainerKill']>
  ) {
    return this.jsonEndpoint<ResponseType<operations['ContainerKill'], 204>>(
      'post',
      `containers/${path.id}/kill`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Update a container
   * @param path Path parameters to update a container
   * @param body Body parameters to update a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerUpdate
   */
  update(
    path: PathParams<operations['ContainerUpdate']>,
    body?: BodyParams<operations['ContainerUpdate']>['update']
  ) {
    return this.jsonEndpoint<ResponseType<operations['ContainerUpdate'], 200>>(
      'post',
      `containers/${path.id}/update`,
      {
        json: body
      }
    )
  }

  /**
   * Rename a container
   * @param path Path parameters to rename a container
   * @param query Query parameters to rename a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerRename
   */
  rename(
    path: PathParams<operations['ContainerRename']>,
    query?: QueryParams<operations['ContainerRename']>
  ) {
    return this.jsonEndpoint<ResponseType<operations['ContainerRename'], 204>>(
      'post',
      `containers/${path.id}/rename`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Pause a container
   * @param path Path parameters to pause a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerPause
   */
  pause(path: PathParams<operations['ContainerPause']>) {
    return this.jsonEndpoint<ResponseType<operations['ContainerPause'], 204>>(
      'post',
      `containers/${path.id}/pause`
    )
  }

  /**
   * Unpause a container
   * @param path Path parameters to unpause a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerUnpause
   */
  unpause(path: PathParams<operations['ContainerUnpause']>) {
    return this.jsonEndpoint<ResponseType<operations['ContainerUnpause'], 204>>(
      'post',
      `containers/${path.id}/unpause`
    )
  }

  // /**
  //  * Attach to a container
  //  * @param path Path parameters to attach to a container
  //  * @param query Query parameters to attach to a container
  //  *
  //  * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerAttach
  //  */
  // attach(
  //   path: PathParams<operations['ContainerAttach']>,
  //   query?: QueryParams<operations['ContainerAttach']>
  // ) {
  //   return this.streamEndpoint('post', `containers/${path.id}/attach`, {
  //     searchParams: query,
  //     json: {}
  //   })
  // }

  /**
   * Wait for a container
   * @param path Path parameters to wait for a container
   * @param query Query parameters to wait for a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerWait
   */
  wait(
    path: PathParams<operations['ContainerWait']>,
    query?: QueryParams<operations['ContainerWait']>
  ) {
    return this.jsonEndpoint<ResponseType<operations['ContainerWait'], 200>>(
      'post',
      `containers/${path.id}/wait`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Delete a container
   * @param path Path parameters to delete a container
   * @param query Query parameters to delete a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerDelete
   */
  delete(
    path: PathParams<operations['ContainerDelete']>,
    query?: QueryParams<operations['ContainerDelete']>
  ) {
    return this.jsonEndpoint<ResponseType<operations['ContainerDelete'], 204>>(
      'delete',
      `containers/${path.id}`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Get an archive of a filesystem resource in a container
   * @param path Path parameters to get an archive of a filesystem resource in a container
   * @param query Query parameters to get an archive of a filesystem resource in a container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerArchiveInfo
   */
  archive(
    path: PathParams<operations['ContainerArchiveInfo']>,
    query?: QueryParams<operations['ContainerArchiveInfo']>
  ) {
    return this.streamEndpoint('get', `containers/${path.id}/archive`, {
      searchParams: query
    })
  }

  /**
   * Delete stopped containers
   * @param query Query parameters to delete stopped containers
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerPrune
   */
  prune(query?: QueryParams<operations['ContainerPrune']>) {
    return this.jsonEndpoint<ResponseType<operations['ContainerPrune'], 200>>(
      'post',
      'containers/prune',
      {
        searchParams: query
      }
    )
  }
}
