/* eslint-disable import/prefer-default-export */
import {
  HttpDeleteRequest,
  HttpGetRequest,
  HttpPatchRequest,
  HttpPostRequest,
  HttpPutRequest,
} from './model/request/HttpRequest.model';
import { HttpResponse } from './model/response/HttpResponse.model';

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
