import {
  BASE_HTTP_HEADER,
  HttpInterfaceService,
} from './Http.interface.service';
import {
  HTTP_VERBS,
  HttpDeleteRequest,
  HttpGetRequest,
  HttpPatchRequest,
  HttpPostRequest,
  HttpPutRequest,
  HttpRequest,
} from './model/request/HttpRequest.model';
import { HttpResponse } from './model/response/HttpResponse.model';
import { HttpResponseError } from './model/response/HttpResponseError.model';

import { isPlainObject } from '../utils/object';

export class HttpService implements HttpInterfaceService {
  /**
   * Perform an HTTP request and returns a parsed JSON object.
   *
   * @param {HttpRequest} httpOptions The HTTP request options.
   * @returns {Promise<HttpResponse<T>>} A promise that resolves with the HTTP response parsed as JSON.
   * @throws {HttpResponseError} Throws an error if the response is not ok.
   */
  private http<T>({
    method,
    endpoint,
    headers,
    body,
  }: HttpRequest): Promise<HttpResponse<T>> {
    const bodyIsJSON = Array.isArray(body) || isPlainObject(body);
    const config = {
      method,
      headers: {
        ...BASE_HTTP_HEADER,
        ...headers,
      },
      body: bodyIsJSON ? JSON.stringify(body) : body,
    } as RequestInit;
    return fetch(endpoint, config).then((response: Response) => {
      if (!response.ok) {
        throw new HttpResponseError(response);
      }
      return response;
    });
  }

  get<T>({ endpoint, headers }: HttpGetRequest): Promise<HttpResponse<T>> {
    return this.http<T>({
      method: HTTP_VERBS.GET,
      endpoint,
      headers,
    });
  }

  post<T>({
    endpoint,
    body,
    headers,
  }: HttpPostRequest): Promise<HttpResponse<T>> {
    return this.http<T>({
      method: HTTP_VERBS.POST,
      endpoint,
      headers,
      body,
    });
  }

  put<T>({
    endpoint,
    body,
    headers,
  }: HttpPutRequest): Promise<HttpResponse<T>> {
    return this.http<T>({
      method: HTTP_VERBS.PUT,
      endpoint,
      headers,
      body,
    });
  }

  patch<T>({
    endpoint,
    headers,
    body,
  }: HttpPatchRequest): Promise<HttpResponse<T>> {
    return this.http<T>({
      method: HTTP_VERBS.PATCH,
      endpoint,
      headers,
      body,
    });
  }

  delete<T>({
    endpoint,
    headers,
  }: HttpDeleteRequest): Promise<HttpResponse<T>> {
    return this.http<T>({
      method: HTTP_VERBS.DELETE,
      endpoint,
      headers,
    });
  }
}
