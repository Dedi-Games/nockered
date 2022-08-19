import { jsonEndpoint } from '../DockerAPI.js'
import { definitions } from '../specs/v1.41.js'
import { GetParamType } from '../utils/GetParamType.js'
import { GetResponseType } from '../utils/GetResponseType.js'
import { AbstractEndpoint } from './AbstractEndpoint.js'

export type ISwarm = definitions['Swarm']
type ClusterInfo = definitions['ClusterInfo']
type JoinTokens = definitions['JoinTokens']

export class Swarm extends AbstractEndpoint<ISwarm> {
  public ClusterInfo!: ClusterInfo
  public JoinTokens!: JoinTokens

  /**
   * Inspect swarm
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Swarm/operation/SwarmInspect
   */
  static inspect() {
    return jsonEndpoint<GetResponseType<'SwarmInspect', 200>>('get', 'swarm')
  }

  /**
   * Initialize a new swarm
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Swarm/operation/SwarmInit
   */
  static init(body: GetParamType<'SwarmInit'>['body']['body']) {
    return jsonEndpoint<GetResponseType<'SwarmInit', 200>>(
      'post',
      'swarm/init',
      {
        json: body
      }
    )
  }

  /**
   * Join an existing swarm
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Swarm/operation/SwarmJoin
   */
  static join(body: GetParamType<'SwarmJoin'>['body']['body']) {
    return jsonEndpoint<GetResponseType<'SwarmJoin', 200>>(
      'post',
      'swarm/join',
      {
        json: body
      }
    )
  }

  /**
   * Leave a swarm
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Swarm/operation/SwarmLeave
   */
  static leave(query?: GetParamType<'SwarmLeave'>['query']) {
    return jsonEndpoint<GetResponseType<'SwarmLeave', 200>>(
      'post',
      'swarm/leave',
      {
        searchParams: query
      }
    )
  }

  /**
   * Update a swarm
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Swarm/operation/SwarmUpdate
   */
  static update(
    query: GetParamType<'SwarmUpdate'>['query'],
    body: GetParamType<'SwarmUpdate'>['body']['body']
  ) {
    return jsonEndpoint<GetResponseType<'SwarmUpdate', 200>>(
      'post',
      'swarm/update',
      {
        searchParams: query,
        json: body
      }
    )
  }

  /**
   * Get the unlock key
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Swarm/operation/SwarmUnlockkey
   */
  static unlockKey() {
    return jsonEndpoint<GetResponseType<'SwarmUnlockkey', 200>>(
      'get',
      'swarm/unlockkey'
    )
  }

  /**
   * Unlock a locked manager
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Swarm/operation/SwarmUnlock
   */
  static unlock(body: GetParamType<'SwarmUnlock'>['body']['body']) {
    return jsonEndpoint<GetResponseType<'SwarmUnlock', 200>>(
      'post',
      'swarm/unlock',
      {
        json: body
      }
    )
  }
}
