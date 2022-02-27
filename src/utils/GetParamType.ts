import { operations } from '../specs/v1.41'

export type GetParamType<Obj extends keyof operations> =
  operations[Obj] extends {
    parameters: unknown
  }
    ? operations[Obj]['parameters']
    : never
