export interface StandardOperation {
  parameters?: {
    path?: any
    query?: any
    body?: any
  }
  responses: {
    [statusCode: string]: {
      schema: any
    }
  }
}
