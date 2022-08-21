import { jsonEndpoint } from '../DockerAPI.js'
import { definitions } from '../specs/v1.41.js'
import { GetParamType } from '../utils/GetParamType.js'
import { GetResponseType } from '../utils/GetResponseType.js'
import { AbstractEndpoint } from './AbstractEndpoint.js'

export type ISecret = definitions['Secret']
type Version = definitions['ObjectVersion']
type Spec = definitions['SecretSpec']

export class Secret extends AbstractEndpoint<ISecret> {
  ID!: string
  Version!: Version
  CreatedAt!: string
  UpdatedAt!: string
  Spec!: Spec

  /**
   * List secrets
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Secret/operation/SecretList
   */
  static list(query?: GetParamType<'SecretList'>['query']) {
    return jsonEndpoint<GetResponseType<'SecretList', 200>>('get', 'secrets', {
      searchParams: query
    })
  }

  /**
   * Create a secret
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Secret/operation/SecretCreate
   */
  static create(body: GetParamType<'SecretCreate'>['body']['body']) {
    return jsonEndpoint<GetResponseType<'SecretCreate', 201>>(
      'post',
      'secrets/create',
      {
        json: body
      }
    )
  }

  /**
   * Inspect a secret
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Secret/operation/SecretInspect
   */
  static inspect(path: GetParamType<'SecretInspect'>['path']) {
    return jsonEndpoint<GetResponseType<'SecretInspect', 200>>(
      'get',
      `secrets/${path.id}`
    )
  }

  /**
   * Inspect a secret
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Secret/operation/SecretInspect
   */
  inspect() {
    return Secret.inspect({ id: this.ID })
  }

  /**
   * Delete a secret
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Secret/operation/SecretDelete
   */
  static delete(path: GetParamType<'SecretDelete'>['path']) {
    return jsonEndpoint<GetResponseType<'SecretDelete', 204>>(
      'delete',
      `secrets/${path.id}`
    )
  }

  /**
   * Delete a secret
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Secret/operation/SecretDelete
   */
  delete() {
    return Secret.delete({ id: this.ID })
  }

  /**
   * Update a Secret
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Secret/operation/SecretUpdate
   */
  static update(
    path: GetParamType<'SecretUpdate'>['path'],
    query: GetParamType<'SecretUpdate'>['query'],
    body: GetParamType<'SecretUpdate'>['body']['body']
  ) {
    return jsonEndpoint<GetResponseType<'SecretUpdate', 200>>(
      'post',
      `secrets/${path.id}/update`,
      {
        searchParams: query,
        json: body
      }
    )
  }

  /**
   * Update a Secret
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Secret/operation/SecretUpdate
   */
  update(
    query: GetParamType<'SecretUpdate'>['query'],
    body: GetParamType<'SecretUpdate'>['body']['body']
  ) {
    return Secret.update({ id: this.ID }, query, body)
  }
}
