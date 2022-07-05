import { HTTPAlias, OptionsInit } from 'got'
import InstanceManager from './InstanceManager.js'
import { DeepRequired } from './utils/DeepRequired.js'

export default class DockerAPI {
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
): Promise<DeepRequired<R>> {
  return InstanceManager.getInstance()
    [method](endpoint, options)
    .json() as Promise<DeepRequired<R>>
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
): Promise<DeepRequired<string>> {
  return InstanceManager.getInstance()
    [method](endpoint, options)
    .text() as Promise<DeepRequired<string>>
}

/**
 * Call stream endpoint
 * @param method HTTP method
 * @param endpoint HTTP endpoint
 * @param options Optional options
 */
export function streamEndpoint<P = OptionsInit>(
  method: HTTPAlias,
  endpoint: string,
  options?: P
) {
  return InstanceManager.getInstance().stream[method](endpoint, options)
}
