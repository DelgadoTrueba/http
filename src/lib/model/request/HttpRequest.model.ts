/* eslint-disable @typescript-eslint/naming-convention  */
import { HttpBody } from '../shared/HttpBody.model';
import { HttpHeader } from '../shared/HttpHeader.model';

export enum HTTP_VERBS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface HttpRequest {
  method:
    | HTTP_VERBS.GET
    | HTTP_VERBS.POST
    | HTTP_VERBS.PUT
    | HTTP_VERBS.PATCH
    | HTTP_VERBS.DELETE;
  endpoint: string;
  headers?: HttpHeader;
  body?: HttpBody;
}

export type HttpGetRequest = Omit<HttpRequest, 'method' | 'body'>;
export type HttpPostRequest = Omit<HttpRequest, 'method'>;
export type HttpPutRequest = Omit<HttpRequest, 'method'>;
export type HttpPatchRequest = Omit<HttpRequest, 'method'>;
export type HttpDeleteRequest = Omit<HttpRequest, 'method' | 'body'>;
