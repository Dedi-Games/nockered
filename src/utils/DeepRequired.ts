export type DeepRequired<T> = {
  [K in keyof T]: DeepRequired<T[K]>
} & Required<T>
