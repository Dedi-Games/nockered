import { operations } from '../specs/v1.41'

export type GetResponseType<
  Obj extends keyof operations,
  Status extends keyof operations[Obj]['responses']
> = operations[Obj]['responses'][Status] extends { schema: unknown }
  ? operations[Obj]['responses'][Status]['schema']
  : operations[Obj]['responses'][Status]
