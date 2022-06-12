export abstract class AbstractEndpoint<Endpoint> {
  constructor(props: Required<Endpoint>) {
    Object.assign(this, props)
  }
}
