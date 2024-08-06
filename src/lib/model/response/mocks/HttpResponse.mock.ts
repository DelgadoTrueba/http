import { HttpResponse } from '../HttpResponse.model';
import { HttpStatusResponse } from '../HttpStatusCodeResponse.model';

const createHttpResponseMock = (
  params: Partial<HttpResponse<unknown>> = {},
): HttpResponse<unknown> => {
  const body = JSON.stringify(params.body || { message: 'Hello, world!' });
  const { headers } = params;

  return new Response(body, {
    headers: headers
      ? new Headers(headers as ResponseInit['headers'])
      : new Headers([['content-type', 'text/plain;charset=UTF-8']]),
    status: params.status || HttpStatusResponse.OK,
    statusText: params.statusText || 'OK',
  });
};

export const HttpResponseMock = {
  create: (params?: Partial<HttpResponse<unknown> & { body: any }>) => {
    return createHttpResponseMock(params);
  },
  createOK: (params?: Partial<HttpResponse<unknown> & { body: any }>) => {
    return createHttpResponseMock({ ...params, status: HttpStatusResponse.OK });
  },
  createOKWithHeaders: (
    params?: Partial<HttpResponse<unknown> & { body: any }>,
  ) => {
    return createHttpResponseMock({
      ...params,
      status: HttpStatusResponse.OK,
      headers: new Headers({
        'X-App-Version': '1.0',
      }),
    });
  },
  createInternalServerError: (
    params?: Partial<HttpResponse<unknown> & { body: any }>,
  ) => {
    return createHttpResponseMock({
      ...params,
      status: HttpStatusResponse.INTERNAL_SERVER_ERROR,
    });
  },
};

//   {
//     headers: new Headers({ 'Content-Type': 'application/json' }),
//     status: status,
//     statusText: 'SUCCESS',
//     ok: status >= 200 && status < 300,
//     redirected: false,
//     url: 'http://localhost:3001/test',
//     body: JSON.stringify({ message: 'Body msg example' }),
//   }
