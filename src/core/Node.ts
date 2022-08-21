import { jsonEndpoint } from '../DockerAPI.js'
import { definitions } from '../specs/v1.41.js'
import { GetParamType } from '../utils/GetParamType.js'
import { GetResponseType } from '../utils/GetResponseType.js'
import { AbstractEndpoint } from './AbstractEndpoint.js'

export type INode = definitions['Node']
type Version = definitions['ObjectVersion']
type Spec = definitions['NodeSpec']
type Description = definitions['NodeDescription']
type Status = definitions['NodeStatus']
type ManagerStatus = definitions['ManagerStatus']

export class Node extends AbstractEndpoint<INode> {
  ID!: string
  Version!: Version
  CreatedAt!: string
  UpdatedAt!: string
  Spec!: Spec
  Description!: Description
  Status!: Status
  ManagerStatus!: ManagerStatus

  /**
   * List nodes
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Node/operation/NodeList
   */
  static list(query?: GetParamType<'NodeList'>['query']) {
    return jsonEndpoint<GetResponseType<'NodeList', 200>>('get', 'nodes', {
      searchParams: query
    })
  }

  /**
   * Inspect a node
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Node/operation/NodeInspect
   */
  static inspect(path: GetParamType<'NodeInspect'>['path']) {
    return jsonEndpoint<GetResponseType<'NodeInspect', 200>>(
      'get',
      `nodes/${path.id}`
    )
  }

  /**
   * Inspect a node
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Node/operation/NodeInspect
   */
  inspect() {
    return Node.inspect({ id: this.ID })
  }

  /**
   * Delete a node
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Node/operation/NodeDelete
   */
  static delete(
    path: GetParamType<'NodeDelete'>['path'],
    query?: GetParamType<'NodeDelete'>['query']
  ) {
    return jsonEndpoint<GetResponseType<'NodeDelete', 200>>(
      'delete',
      `nodes/${path.id}`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Delete a node
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Node/operation/NodeDelete
   */
  delete(query?: GetParamType<'NodeDelete'>['query']) {
    return Node.delete({ id: this.ID }, query)
  }

  /**
   * Update a node
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Node/operation/NodeUpdate
   */
  static update(
    path: GetParamType<'NodeUpdate'>['path'],
    query: GetParamType<'NodeUpdate'>['query'],
    body: GetParamType<'NodeUpdate'>['body']['body']
  ) {
    return jsonEndpoint<GetResponseType<'NodeUpdate', 200>>(
      'post',
      `nodes/${path.id}/update`,
      {
        searchParams: query,
        json: body
      }
    )
  }

  /**
   * Update a node
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Node/operation/NodeUpdate
   */
  update(
    query: GetParamType<'NodeUpdate'>['query'],
    body: GetParamType<'NodeUpdate'>['body']['body']
  ) {
    return Node.update({ id: this.ID }, query, body)
  }
}
