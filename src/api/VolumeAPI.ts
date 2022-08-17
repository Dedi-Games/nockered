import { plainToInstance } from 'class-transformer'
import { Volume } from '../core/Volume.js'
import { GetParamType } from '../utils/GetParamType.js'

export class VolumeAPI {
  /**
   * List volumes
   */
  static async list(query?: GetParamType<'VolumeList'>['query']) {
    return plainToInstance(Volume, (await Volume.list(query)).Volumes)
  }

  /**
   * Get volume
   * @param name Volume Name
   */
  static async get(name: string) {
    const volume = await Volume.list({
      filters: JSON.stringify({ name: [name] })
    })
    return plainToInstance(Volume, volume.Volumes[0])
  }

  /**
   * Create a volume
   */
  static async create(body: GetParamType<'VolumeCreate'>['body']['volumeConfig']) {
    const createdVolume = await Volume.create(body)
    const volume = await Volume.list({
      filters: JSON.stringify({ name: [createdVolume.Name] })
    })
    return plainToInstance(Volume, volume.Volumes[0])
  }
}