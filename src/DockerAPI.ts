import InstanceManager from './InstanceManager'
import { IDockerAPI } from './types/IDockerAPI'

export class DockerAPI implements IDockerAPI {
  constructor(prefixUrl: string) {
    InstanceManager.setInstance(prefixUrl)
  }

  makeACall() {
    console.log(InstanceManager.getInstance())
  }
}
