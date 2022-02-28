import { HTTPAlias, OptionsInit } from 'got'
import InstanceManager from './InstanceManager.js'
import { System } from './api/System.js'
import { IDockerApi } from './types/IDockerApi.js'

export default class DockerAPI implements IDockerApi {
  public system = new System()

  constructor(prefixUrl: string) {
    InstanceManager.setInstance(prefixUrl)
  }
}

/**
 * Call JSON endpoint
 * @param method HTTP method
 * @param endpoint HTTP endpoint
 * @param options Optional options
 */
export function jsonEndpoint<R = {}, P = OptionsInit>(
  method: HTTPAlias,
  endpoint: string,
  options?: P
): Promise<R> {
  return InstanceManager.getInstance()
    [method](endpoint, options)
    .json() as Promise<R>
}

/**
 * Call string endpoint
 * @param method HTTP method
 * @param endpoint HTTP endpoint
 * @param options Optional options
 */
export function stringEndpoint<P = OptionsInit>(
  method: HTTPAlias,
  endpoint: string,
  options?: P
): Promise<string> {
  return InstanceManager.getInstance()
    [method](endpoint, options)
    .text() as Promise<string>
}

/**
 * Call stream endpoint
 * @param endpoint HTTP endpoint
 * @param options Optional options
 */
export function streamEndpoint<P = OptionsInit>(endpoint: string, options?: P) {
  return InstanceManager.getInstance().stream(endpoint, options)
}
