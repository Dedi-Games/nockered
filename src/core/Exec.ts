import { jsonEndpoint } from '../DockerAPI.js'
import { GetParamType } from '../utils/GetParamType.js'
import { GetResponseType } from '../utils/GetResponseType.js'

export class Exec {
  /**
   * Create an exec instance
   * @description Run a command inside a running container.
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Exec/operation/ContainerExec
   */
  static create(
    path: GetParamType<'ContainerExec'>['path'],
    body: GetParamType<'ContainerExec'>['body']['execConfig']
  ) {
    return jsonEndpoint<GetResponseType<'ContainerExec', 201>>(
      'post',
      `containers/${path.id}/exec`,
      {
        json: body
      }
    )
  }

  /**
   * Start an exec instance
   * @description Starts a previously set up exec instance. If detach is true, this endpoint returns immediately after starting the command. Otherwise, it sets up an interactive session with the command.
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Exec/operation/ExecStart
   */
  static start(
    path: GetParamType<'ExecStart'>['path'],
    body: GetParamType<'ExecStart'>['body']['execStartConfig']
  ) {
    return jsonEndpoint<GetResponseType<'ExecStart', 200>>(
      'post',
      `exec/${path.id}/start`,
      {
        json: body
      }
    )
  }

  /**
   * Resize an exec instance
   * @description Resize the TTY session used by an exec instance. This endpoint only works if tty was specified as part of creating and starting the exec instance.
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Exec/operation/ExecResize
   */
  static resize(
    path: GetParamType<'ExecResize'>['path'],
    query?: GetParamType<'ExecResize'>['query']
  ) {
    return jsonEndpoint<GetResponseType<'ExecResize', 201>>(
      'post',
      `exec/${path.id}/resize`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Inspect an exec instance
   * @description Return low-level information about an exec instance.
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Exec/operation/ExecInspect
   */
  static inspect(path: GetParamType<'ExecInspect'>['path']) {
    return jsonEndpoint<GetResponseType<'ExecInspect', 200>>(
      'get',
      `exec/${path.id}/json`
    )
  }
}