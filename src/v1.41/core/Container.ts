import { Options } from 'got'
import { BaseAPI } from '../../common/BaseAPI.js'
import { QueryParams } from '../../utils/QueryParams.js'
import { definitions, operations } from '../specs.js'
import { BaseContainer } from './BaseContainer.js'

export type ContainerSummary = definitions['ContainerSummary']

export class Container extends BaseAPI implements Required<ContainerSummary> {
  /**
   * Base instance
   */
  #base: BaseContainer

  /**
   * Container properties
   */
  Id!: string
  Command!: string
  Created!: number
  HostConfig!: { NetworkMode?: string }
  Image!: string
  ImageID!: string
  Labels!: { [p: string]: string }
  Mounts!: []
  Names!: string[]
  NetworkSettings!: {
    Networks?: { [p: string]: definitions['EndpointSettings'] }
  }
  Ports!: definitions['Port'][]
  SizeRootFs!: number
  SizeRw!: number
  State!: string
  Status!: string

  constructor(options: Pick<Options, 'prefixUrl'>) {
    super(options)
    this.#base = new BaseContainer(options)
  }

  /**
   * Inspect the container
   * @param query Query parameters to inspect the container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerInspect
   */
  inspect(query?: QueryParams<operations['ContainerInspect']>) {
    return this.#base.inspect({ id: this.Id }, query)
  }

  /**
   * List processes running inside the container
   * @param query Query parameters to list processes running inside the container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerTop
   */
  listProcesses(query?: QueryParams<operations['ContainerTop']>) {
    return this.#base.listProcesses({ id: this.Id }, query)
  }

  /**
   * Get container logs
   * @param query Query parameters to get container logs
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerLogs
   */
  logs(query?: QueryParams<operations['ContainerLogs']>) {
    return this.#base.logs({ id: this.Id }, query)
  }

  /**
   * Get containers logs as a stream
   * @param query Query parameters to get container logs as a stream
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerLogs
   */
  logsStream(query?: QueryParams<operations['ContainerLogs']>) {
    return this.#base.logsStream({ id: this.Id }, query)
  }

  /**
   * Get changes on the container's filesystem
   * @param query Query parameters to get changes on the container's filesystem
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerChanges
   */
  changes(query?: QueryParams<operations['ContainerChanges']>) {
    return this.#base.changes({ id: this.Id }, query)
  }

  /**
   * Export the container
   * @param query Query parameters to export the container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerExport
   */
  export(query?: QueryParams<operations['ContainerExport']>) {
    return this.#base.export({ id: this.Id }, query)
  }

  /**
   * Get container stats based on resource usage
   * @param query Query parameters to get container stats based on resource usage
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerStats
   */
  stats(query?: QueryParams<operations['ContainerStats']>) {
    return this.#base.stats({ id: this.Id }, query)
  }

  /**
   * Get container stats based on resource usage as a stream
   * @param query Query parameters to get container stats based on resource usage as a stream
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerStats
   */
  statsStream(query?: QueryParams<operations['ContainerStats']>) {
    return this.#base.statsStream({ id: this.Id }, query)
  }

  /**
   * Resize the container's TTY
   * @param query Query parameters to resize the container's TTY
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerResize
   */
  resize(query: QueryParams<operations['ContainerResize']>) {
    return this.#base.resize({ id: this.Id }, query)
  }

  /**
   * Start the container
   * @param query Query parameters to start the container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerStart
   */
  start(query?: QueryParams<operations['ContainerStart']>) {
    return this.#base.start({ id: this.Id }, query)
  }

  /**
   * Stop the container
   * @param query Query parameters to stop the container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerStop
   */
  stop(query?: QueryParams<operations['ContainerStop']>) {
    return this.#base.stop({ id: this.Id }, query)
  }

  /**
   * Restart the container
   * @param query Query parameters to restart the container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerRestart
   */
  restart(query?: QueryParams<operations['ContainerRestart']>) {
    return this.#base.restart({ id: this.Id }, query)
  }

  /**
   * Kill the container
   * @param query Query parameters to kill the container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerKill
   */
  kill(query?: QueryParams<operations['ContainerKill']>) {
    return this.#base.kill({ id: this.Id }, query)
  }

  /**
   * Update the container
   * @param query Query parameters to update the container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerUpdate
   */
  update(query?: QueryParams<operations['ContainerUpdate']>) {
    return this.#base.update({ id: this.Id }, query)
  }

  /**
   * Rename the container
   * @param query Query parameters to rename the container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerRename
   */
  rename(query?: QueryParams<operations['ContainerRename']>) {
    return this.#base.rename({ id: this.Id }, query)
  }

  /**
   * Pause the container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerPause
   */
  pause() {
    return this.#base.pause({ id: this.Id })
  }

  /**
   * Unpause the container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerUnpause
   */
  unpause() {
    return this.#base.unpause({ id: this.Id })
  }

  /**
   * Wait for the container to stop
   * @param query Query parameters to wait for the container to stop
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerWait
   */
  wait(query?: QueryParams<operations['ContainerWait']>) {
    return this.#base.wait({ id: this.Id }, query)
  }

  /**
   * Delete the container
   * @param query Query parameters to delete the container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerDelete
   */
  delete(query?: QueryParams<operations['ContainerDelete']>) {
    return this.#base.delete({ id: this.Id }, query)
  }

  /**
   * Archive the container
   * @param query Query parameters to archive the container
   *
   * @see https://docs.docker.com/engine/api/v1.41/#operation/ContainerArchive
   */
  archive(query?: QueryParams<operations['ContainerArchive']>) {
    return this.#base.archive({ id: this.Id }, query)
  }
}
