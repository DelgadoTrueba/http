import * as pathToRegexp from 'path-to-regexp';

import type {
  HttpInterfaceMockAdapter,
  MockAdapterResponseFnc,
  MockAdapterResponseFncParams,
} from './HttpMock.interface.service';
import type {
  HttpGetRequest,
  HttpRequest,
  HttpDeleteRequest,
} from './model/request/HttpRequest.model';
import type { HttpResponse } from './model/response/HttpResponse.model';
import { HttpHeaderRequest } from './model/request/HttpHeaderRequest.model';
import { HttpResponseError } from './model/response/HttpResponseError.model';
import { sleep } from '../utils/sleep';
import { removeBaseURL } from '../utils/url';
import { isPlainObject } from '../utils/object';

export const BASE_HTTP_HEADER: HttpHeaderRequest = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export class HttpMockService implements HttpInterfaceMockAdapter {
  private mockResponsesGet = new Map<string, MockAdapterResponseFnc<any>>();

  private mockResponsesPost = new Map<string, MockAdapterResponseFnc<any>>();

  private mockResponsesPut = new Map<string, MockAdapterResponseFnc<any>>();

  private mockResponsesPatch = new Map<string, MockAdapterResponseFnc<any>>();

  private mockResponsesDelete = new Map<string, MockAdapterResponseFnc<any>>();

  private matchUrl(
    endpoint: string,
    urlsPattern: string[],
  ): { urlPattern: string; params: Record<string, string> } | null {
    let resul: any | null = null;

    urlsPattern.forEach((urlPattern) => {
      const [path, queryString] = urlPattern.split('?');
      let url = path;
      if (queryString) {
        url = `${url}\\?${queryString}`;
      }

      const checkUrl = pathToRegexp.match(url, {
        decode: decodeURIComponent,
      });

      const match = checkUrl(endpoint);

      if (match) {
        resul = {
          urlPattern,
          params: match?.params ?? {},
        };
      }
    });

    return resul;
  }

  private async httpMock<T>(
    endpoint: string,
    urlsPattern: string[],
    mockResponse: Map<string, MockAdapterResponseFnc<any>>,
    { headers, body }: Omit<MockAdapterResponseFncParams, 'params'>,
  ): Promise<HttpResponse<T>> {
    const match = this.matchUrl(removeBaseURL(endpoint), urlsPattern);

    if (!match) throw new Error('No mock response for URL');

    const mockFnc = mockResponse.get(
      match.urlPattern,
    ) as MockAdapterResponseFnc<T>;

    await sleep(500);

    const bodyIsJSON = Array.isArray(body) || isPlainObject(body);

    return mockFnc({
      params: match.params,
      headers,
      body: bodyIsJSON ? JSON.stringify(body) : body,
    })
      .then((data) => {
        const { status, response, headers: responseHeaders } = data;
        return Promise.resolve({
          ok: status >= 200 && status <= 299,
          json: () => Promise.resolve(response),
          status,
          headers: responseHeaders,
        }) as unknown as HttpResponse<T>;
      })
      .catch((error) => {
        const { status, response, headers: responseHeaders } = error;
        throw new HttpResponseError({
          json: () => Promise.resolve(response),
          ok: status >= 200 && status <= 299,
          status,
          headers: responseHeaders,
        } as unknown as HttpResponse<T>);
      });
  }

  onGet<T>(urlPattern: string, mockFnc: MockAdapterResponseFnc<T>): void {
    this.mockResponsesGet.set(removeBaseURL(urlPattern), mockFnc);
  }

  get<T>({ endpoint, headers }: HttpGetRequest): Promise<HttpResponse<T>> {
    const urlsPattern = Array.from(this.mockResponsesGet.keys());
    return this.httpMock(endpoint, urlsPattern, this.mockResponsesGet, {
      headers: {
        ...BASE_HTTP_HEADER,
        ...headers,
      },
    });
  }

  onPost<T>(urlPattern: string, mockFnc: MockAdapterResponseFnc<T>): void {
    this.mockResponsesPost.set(removeBaseURL(urlPattern), mockFnc);
  }

  post<T>({ endpoint, body, headers }: HttpRequest): Promise<HttpResponse<T>> {
    const urlsPattern = Array.from(this.mockResponsesPost.keys());
    return this.httpMock(endpoint, urlsPattern, this.mockResponsesPost, {
      headers: {
        ...BASE_HTTP_HEADER,
        ...headers,
      },
      body,
    });
  }

  onPut<T>(urlPattern: string, mockFnc: MockAdapterResponseFnc<T>): void {
    this.mockResponsesPut.set(removeBaseURL(urlPattern), mockFnc);
  }

  put<T>({ endpoint, body, headers }: HttpRequest): Promise<HttpResponse<T>> {
    const urlsPattern = Array.from(this.mockResponsesPut.keys());
    return this.httpMock(endpoint, urlsPattern, this.mockResponsesPut, {
      headers: {
        ...BASE_HTTP_HEADER,
        ...headers,
      },
      body,
    });
  }

  onPatch<T>(urlPattern: string, mockFnc: MockAdapterResponseFnc<T>): void {
    this.mockResponsesPatch.set(removeBaseURL(urlPattern), mockFnc);
  }

  patch<T>({ endpoint, headers, body }: HttpRequest): Promise<HttpResponse<T>> {
    const urlsPattern = Array.from(this.mockResponsesPatch.keys());
    return this.httpMock(endpoint, urlsPattern, this.mockResponsesPatch, {
      headers: {
        ...BASE_HTTP_HEADER,
        ...headers,
      },
      body,
    });
  }

  onDelete<T>(urlPattern: string, mockFnc: MockAdapterResponseFnc<T>): void {
    this.mockResponsesDelete.set(removeBaseURL(urlPattern), mockFnc);
  }

  delete<T>({
    endpoint,
    headers,
  }: HttpDeleteRequest): Promise<HttpResponse<T>> {
    const urlsPattern = Array.from(this.mockResponsesDelete.keys());
    return this.httpMock(endpoint, urlsPattern, this.mockResponsesDelete, {
      headers: {
        ...BASE_HTTP_HEADER,
        ...headers,
      },
    });
  }
}
