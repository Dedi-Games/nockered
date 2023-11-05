export type BodyParams<Operation> = Operation extends {
  parameters: { body: infer B }
}
  ? B
  : never
