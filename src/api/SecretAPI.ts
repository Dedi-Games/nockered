import { plainToInstance } from 'class-transformer'
import { Secret } from '../core/Secret.js'
import { GetParamType } from '../utils/GetParamType.js'

export class SecretAPI {
  /**
   * List secrets
   */
  static async list(query?: GetParamType<'SecretList'>['query']) {
    return plainToInstance(Secret, await Secret.list(query))
  }

  /**
   * Get secret
   * @param id Secret ID
   */
  static async get(id: string) {
    const secret = await Secret.list({
      filters: JSON.stringify({ id: [id] })
    })
    return plainToInstance(Secret, secret[0])
  }

  /**
   * Create a secret
   */
  static async create(body: GetParamType<'SecretCreate'>['body']['body']) {
    const createdSecret = await Secret.create(body)
    const secret = await Secret.list({
      filters: JSON.stringify({ id: [createdSecret.Id] })
    })
    return plainToInstance(Secret, secret[0])
  }
}
