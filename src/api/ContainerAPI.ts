import { plainToInstance } from 'class-transformer'
import { Container } from '../core/Container.js'
import { GetParamType } from '../utils/GetParamType.js'

export class ContainerAPI {
  /**
   * List containers
   */
  static async list(query?: GetParamType<'ContainerList'>['query']) {
    return plainToInstance(Container, await Container.list(query))
  }

  /**
   * Get container
   * @param id Container ID
   * @kind Custom API
   */
  static async get(id: string) {
    const container = await Container.list({
      all: true,
      filters: JSON.stringify({ id: [id] })
    })
    return plainToInstance(Container, container[0])
  }

  /**
   * Create a container
   */
  static async create(
    query: GetParamType<'ContainerCreate'>['query'],
    body: GetParamType<'ContainerCreate'>['body']['body']
  ) {
    const createdContainer = await Container.create(query, body)
    const container = await Container.list({
      all: true,
      filters: JSON.stringify({ id: [createdContainer.Id] })
    })
    return plainToInstance(Container, container[0])
  }
}
