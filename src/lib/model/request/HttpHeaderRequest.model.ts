import { HttpHeader } from '../shared/HttpHeader.model';

export type HttpHeaderRequest = HttpHeader & {
  Accept?: string; // "application/json"
  'Content-Type'?: string; // "application/json"
  'Cache-Control'?: string; // "no-cache"
};
