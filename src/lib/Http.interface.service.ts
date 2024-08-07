/* eslint-disable import/prefer-default-export */
import { HttpHeaderRequest } from './model/request/HttpHeaderRequest.model';
import {
  HttpDeleteRequest,
  HttpGetRequest,
  HttpPatchRequest,
  HttpPostRequest,
  HttpPutRequest,
} from './model/request/HttpRequest.model';
import { HttpResponse } from './model/response/HttpResponse.model';

export const BASE_HTTP_HEADER: HttpHeaderRequest = {
  Accept: 'application/json',
  'Content-Type': 'application/json', // TODO only JSON.stringify
};

export abstract class HttpInterfaceService {
  abstract get<T>({
    endpoint,
    headers,
  }: HttpGetRequest): Promise<HttpResponse<T>>;

  abstract post<T>({
    endpoint,
    body,
    headers,
  }: HttpPostRequest): Promise<HttpResponse<T>>;

  abstract put<T>({
    endpoint,
    body,
    headers,
  }: HttpPutRequest): Promise<HttpResponse<T>>;

  abstract patch<T>({
    endpoint,
    headers,
    body,
  }: HttpPatchRequest): Promise<HttpResponse<T>>;

  abstract delete<T>({
    endpoint,
    headers,
  }: HttpDeleteRequest): Promise<HttpResponse<T>>;
}
