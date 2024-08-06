import { HttpHeader } from '../../shared/HttpHeader.model';
import { HTTP_VERBS, HttpRequest } from '../HttpRequest.model';

const createHttpRequestMock = (
  params: Partial<HttpRequest> = {},
): HttpRequest => {
  return {
    method: params.method ?? HTTP_VERBS.POST,
    endpoint: params.endpoint ?? 'http://localhost:3001/test',
    headers: (params?.headers ?? {}) as HttpHeader,
    body: params?.body ?? undefined,
  };
};

export const HttpRequestMock = {
  create: (params?: Partial<HttpRequest>) => {
    return createHttpRequestMock(params);
  },
  createGET: (params?: Partial<HttpRequest>) => {
    return createHttpRequestMock({
      ...params,
      method: HTTP_VERBS.GET,
      body: undefined,
    });
  },
  createGETWithHeaders: (params?: Partial<HttpRequest>) => {
    return createHttpRequestMock({
      ...params,
      method: HTTP_VERBS.GET,
      headers: {
        'X-App-Version': '1.0',
      },
      body: undefined,
    });
  },
  createPOST: (params?: Partial<HttpRequest>) => {
    return createHttpRequestMock({
      body: { message: 'text' },
      ...params,
      method: HTTP_VERBS.POST,
    });
  },
  createPUT: (params?: Partial<HttpRequest>) => {
    return createHttpRequestMock({
      method: HTTP_VERBS.PUT,
      ...params,
      body: { message: 'text' },
    });
  },
  createPATCH: (params?: Partial<HttpRequest>) => {
    return createHttpRequestMock({
      body: { message: 'text' },
      ...params,
      method: HTTP_VERBS.PATCH,
    });
  },
  createDELETE: (params?: Partial<HttpRequest>) => {
    return createHttpRequestMock({
      ...params,
      method: HTTP_VERBS.DELETE,
    });
  },
};
