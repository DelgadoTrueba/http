// TODO review JSON.stringdy
export type HttpBody =
  | BodyInit
  | { [key: string]: unknown }
  | Array<unknown>
  | string
  | FormData;
