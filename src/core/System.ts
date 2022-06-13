import { jsonEndpoint, streamEndpoint, stringEndpoint } from '../DockerAPI.js'
import { GetParamType } from '../utils/GetParamType.js'
import { GetResponseType } from '../utils/GetResponseType.js'

export class System {
  /**
   * Check auth configuration
   * @description Validate credentials for a registry and, if available, get an identity token for accessing the registry without password.
   * @param authConfig Authentication to check
   */
  static checkAuthConfiguration(
    authConfig: GetParamType<'SystemAuth'>['body']['authConfig']
  ) {
    return jsonEndpoint<GetResponseType<'SystemAuth', 200>>('post', 'auth', {
      json: authConfig
    })
  }

  /**
   * Get system information
   */
  static getSystemInformation() {
    return jsonEndpoint<GetResponseType<'SystemInfo', 200>>('get', 'info')
  }

  /**
   * Get version
   * @description Returns the version of Docker that is running and various information about the system that Docker is running on.
   */
  static getVersion() {
    return jsonEndpoint<GetResponseType<'SystemVersion', 200>>('get', 'version')
  }

  /**
   * Ping
   * @description This is a dummy endpoint you can use to test if the server is accessible.
   */
  static ping() {
    return stringEndpoint<GetResponseType<'SystemPing', 200>>('get', '_ping')
  }

  /**
   * Ping
   * @description This is a dummy endpoint you can use to test if the server is accessible.
   */
  static pingHead() {
    return stringEndpoint<GetResponseType<'SystemPingHead', 200>>(
      'head',
      '_ping'
    )
  }

  /**
   * Monitor events
   * @description Stream real-time events from the server.
   * @param query Query parameters
   */
  static monitorEvents(query?: GetParamType<'SystemEvents'>['query']) {
    return streamEndpoint('events', { searchParams: query })
  }

  /**
   * Get data usage information
   */
  static getDataUsageInformation() {
    return jsonEndpoint<GetResponseType<'SystemDataUsage', 200>>(
      'get',
      'system/df'
    )
  }
}
