import { StandardOperation } from './StandardOperation.js'

export type ResponseType<
  Operation extends StandardOperation,
  StatusCode extends keyof Operation['responses']
> = Operation['responses'][StatusCode]['schema']
