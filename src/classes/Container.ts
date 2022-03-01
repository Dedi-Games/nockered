import { jsonEndpoint } from '../DockerAPI.js'
import { definitions } from '../specs/v1.41.js'

export type ContainerSummary = definitions['ContainerSummary']
type Mount = definitions['Mount']
type EndpointSettings = definitions['EndpointSettings']
type Port = definitions['Port']

export class Container implements Required<ContainerSummary> {
  public Command!: string
  public Created!: number
  public HostConfig!: { NetworkMode?: string }
  public Id!: string
  public Image!: string
  public ImageID!: string
  public Labels!: { [p: string]: string }
  public Mounts!: Mount[]
  public Names!: string[]
  public NetworkSettings!: {
    Networks: { [p: string]: EndpointSettings }
  }
  public Ports!: Port[]
  public SizeRootFs!: number
  public SizeRw!: number
  public State!: string
  public Status!: string

  constructor(props: Required<ContainerSummary>) {
    Object.assign(this, props)
  }
}
