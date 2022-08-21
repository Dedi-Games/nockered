import { plainToInstance } from 'class-transformer'
import { Node } from '../core/Node.js'
import { GetParamType } from '../utils/GetParamType.js'

export class NodeAPI {
  /**
   * List nodes
   */
  static async list(query?: GetParamType<'NodeList'>['query']) {
    return plainToInstance(Node, await Node.list(query))
  }

  /**
   * Get node
   * @param id Node ID
   */
  static async get(id: string) {
    const nodes = await Node.list({
      filters: JSON.stringify({ id: [id] })
    })
    return plainToInstance(Node, nodes[0])
  }
}
