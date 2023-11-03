import got, { Got, Options } from 'got'

export abstract class BaseDockerEngineAPI {
  protected got: Got

  protected constructor(options: Pick<Options, 'prefixUrl'>) {
    // "(got as Got)" to have the right extend() function typing
    this.got = (got as Got).extend(options)
  }

  getGotInstance() {
    return this.got
  }
}
