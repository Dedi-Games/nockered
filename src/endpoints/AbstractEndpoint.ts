export abstract class AbstractEndpoint<Endpoint> {
  protected constructor(props: Required<Endpoint>) {
    Object.assign(this, props)
  }
}
