import { plainToClassFromExist } from 'class-transformer'
import { Options } from 'got'
import { QueryParams } from '../../utils/QueryParams.js'
import { BaseContainer } from '../core/BaseContainer.js'
import { Container } from '../core/Container.js'
import { operations } from '../specs.js'

export class ContainerAPI {
  #base: BaseContainer

  constructor(private options: Pick<Options, 'prefixUrl'>) {
    this.#base = new BaseContainer(this.options)
  }

  async list(
    query?: QueryParams<operations['ContainerList']>
  ): Promise<Container[]> {
    const containers = await this.#base.list(query)
    if (!containers.success) {
      throw new Error(containers.error)
    }
    return containers.data.map((container) =>
      plainToClassFromExist(new Container(this.options), container)
    )
  }
}
