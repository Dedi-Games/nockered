export type QueryParams<Operation> = Operation extends {
  parameters: { query: infer Q }
}
  ? Q
  : never
