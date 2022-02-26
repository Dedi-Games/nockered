import InstanceManager from './InstanceManager'
import { IDockerAPI } from './types'

export class DockerAPI implements IDockerAPI {
  constructor(prefixUrl: string) {
    InstanceManager.setInstance(prefixUrl)
  }

  makeACall() {
    console.log(InstanceManager.getInstance())
  }
}
