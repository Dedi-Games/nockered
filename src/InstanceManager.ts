import { got, Got } from 'got'

class InstanceManager {
  #instance?: Got

  /**
   * Set Got instance
   * @param prefixUrl Got prefix URL
   */
  setInstance(prefixUrl: string): void {
    this.#instance = got.extend({
      prefixUrl
    })
  }

  /**
   * Get Got instance
   */
  getInstance(): Got {
    return this.#instance ?? got
  }
}

export default new InstanceManager()
