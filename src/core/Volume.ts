import { jsonEndpoint } from '../DockerAPI.js'
import { definitions } from '../specs/v1.41.js'
import { GetParamType } from '../utils/GetParamType.js'
import { GetResponseType } from '../utils/GetResponseType.js'
import { AbstractEndpoint } from './AbstractEndpoint.js'

export type IVolume = definitions['Volume']

export class Volume extends AbstractEndpoint<IVolume> {
  public Name!: string
  public Drier!: string
  public Mountpoint!: string
  public CreatedAt!: string
  public Status!: { [p: string]: { [p: string]: unknown } }
  public Labels!: { [p: string]: string }
  public Scope!: 'local' | 'global'
  public Options!: { [p: string]: string }
  public UsageData!: {
    Size: number
    RefCount: number
  }

  /**
   * List volumes
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Volume/operation/VolumeList
   */
  static list(query?: GetParamType<'VolumeList'>['query']) {
    return jsonEndpoint<GetResponseType<'VolumeList', 200>>(
      'get',
      'volumes',
      { searchParams: query }
    )
  }

  /**
   * Create a volume
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Volume/operation/VolumeCreate
   */
  static create(body: GetParamType<'VolumeCreate'>['body']['volumeConfig']) {
    return jsonEndpoint<GetResponseType<'VolumeCreate', 201>>(
      'post',
      'volumes/create',
      {
        json: body
      }
    )
  }

  /**
   * Inspect a volume
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Volume/operation/VolumeInspect
   */
  static inspect(path: GetParamType<'VolumeInspect'>['path']) {
    return jsonEndpoint<GetResponseType<'VolumeInspect', 200>>(
      'get',
      `volumes/${path.name}`
    )
  }

  /**
   * Inspect a volume
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Volume/operation/VolumeInspect
   */
  inspect() {
    return Volume.inspect({ name: this.Name })
  }

  /**
   * Remove a volume
   * @description Instruct the driver to remove the volume.
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Volume/operation/VolumeDelete
   */
  static delete(
    path: GetParamType<'VolumeDelete'>['path'],
    query?: GetParamType<'VolumeDelete'>['query']
  ) {
    return jsonEndpoint<GetResponseType<'VolumeDelete', 204>>(
      'delete',
      `volumes/${path.name}`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Remove a volume
   * @description Instruct the driver to remove the volume.
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Volume/operation/VolumeDelete
   */
  delete(query?: GetParamType<'VolumeDelete'>['query']) {
    return Volume.delete({ name: this.Name }, query)
  }

  /**
   * Delete unused volumes
   * @link https://docs.docker.com/engine/api/v1.41/#tag/Volume/operation/VolumePrune
   */
  static prune(query?: GetParamType<'VolumePrune'>['query']) {
    return jsonEndpoint<GetResponseType<'VolumePrune', 200>>(
      'post',
      'volumes/prune',
      {
        searchParams: query
      }
    )
  }
}