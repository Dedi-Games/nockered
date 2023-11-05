export type PathParams<Operation> = Operation extends {
  parameters: { path: infer P }
}
  ? P
  : never
