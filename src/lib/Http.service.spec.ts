import getGlobalObject from '../utils-test/getGlobalObject';

import { BASE_HTTP_HEADER, HttpService } from './Http.service';
import { HttpResponse } from './model/response/HttpResponse.model';
import { HttpStatusResponse } from './model/response/HttpStatusCodeResponse.model';

import { HTTP_VERBS } from './model/request/HttpRequest.model';
import { HttpRequestMock } from './model/request/mocks/HttpRequest.mock';
import { HttpResponseMock } from './model/response/mocks/HttpResponse.mock';
import { HttpResponseError } from './model/response/HttpResponseError.model';

const setup = (
  response: HttpResponse<unknown> = new Response(null, { status: 200 }),
) => {
  const fetchSpy: jest.SpyInstance = jest
    .spyOn(getGlobalObject(), 'fetch')
    .mockResolvedValue(Promise.resolve(response));

  const httpService = new HttpService();

  return {
    httpService,
    fetchSpy,
  };
};

describe('HttpService', () => {
  it('should run constructor()', () => {
    expect(new HttpService()).toBeTruthy();
  });

  describe('GET', () => {
    it('should call fetch with correct parameters for GET request', async () => {
      const httpRequest = HttpRequestMock.createGET();
      const httpResponse = HttpResponseMock.createOK();
      const { httpService, fetchSpy } = setup(httpResponse);

      await httpService.get<unknown>({
        endpoint: httpRequest.endpoint,
      });

      expect(fetchSpy).toHaveBeenCalledWith(httpRequest.endpoint, {
        method: HTTP_VERBS.GET,
        headers: BASE_HTTP_HEADER,
        body: undefined,
      });
    });

    it('should call fetch with correct parameters for GET request with extra headers', () => {
      const httpRequest = HttpRequestMock.createGETWithHeaders({
        headers: {
          'X-App-Version': '1.0',
        },
      });
      const { httpService, fetchSpy } = setup();

      httpService.get<unknown>(httpRequest);

      expect(fetchSpy).toHaveBeenCalledWith(httpRequest.endpoint, {
        method: HTTP_VERBS.GET,
        headers: { ...BASE_HTTP_HEADER, ...httpRequest.headers },
        body: undefined,
      });
    });

    it('should simulate fetch call (status >= 200 && status <= 299) and return correct mock for GET', async () => {
      const httpRequest = HttpRequestMock.createGET();
      const httpResponse = HttpResponseMock.createOK();
      const { httpService } = setup(httpResponse);

      const response = await httpService.get<unknown>({
        endpoint: httpRequest.endpoint,
      });

      expect(response.status).toBe(HttpStatusResponse.OK);
      expect(response.body).toBe(httpResponse.body);
      expect(response.headers.get('content-type')).toEqual(
        'text/plain;charset=UTF-8',
      );
    });

    it('should simulate fetch error call (status < 200 || status > 299) and return correct mock for GET', async () => {
      const httpRequest = HttpRequestMock.createGET();
      const httpResponse = HttpResponseMock.createInternalServerError();
      const { httpService } = setup(httpResponse);

      let thrownError!: HttpResponseError<unknown>;
      try {
        await httpService.get<unknown>({
          endpoint: httpRequest.endpoint,
        });
      } catch (error) {
        if (error instanceof HttpResponseError) {
          thrownError = error;
        }
      }

      expect(thrownError.response.status).toBe(
        HttpStatusResponse.INTERNAL_SERVER_ERROR,
      );
      expect(thrownError.response.body).toBe(httpResponse.body);
      expect(thrownError.response.headers.get('content-type')).toEqual(
        'text/plain;charset=UTF-8',
      );
    });
  });

  describe('POST', () => {
    it('should call fetch with correct parameters for POST request', () => {
      const httpRequest = HttpRequestMock.createPOST();
      const { httpService, fetchSpy } = setup();

      httpService.post<unknown>(httpRequest);

      expect(fetchSpy).toHaveBeenCalledWith(httpRequest.endpoint, {
        method: HTTP_VERBS.POST,
        headers: BASE_HTTP_HEADER,
        body: JSON.stringify(httpRequest.body),
      });
    });
  });

  describe('PUT', () => {
    it('should call fetch with correct parameters for PUT request', () => {
      const httpRequest = HttpRequestMock.createPUT();
      const { httpService, fetchSpy } = setup();

      httpService.put<unknown>(httpRequest);

      expect(fetchSpy).toHaveBeenCalledWith(httpRequest.endpoint, {
        method: HTTP_VERBS.PUT,
        headers: BASE_HTTP_HEADER,
        body: JSON.stringify(httpRequest.body),
      });
    });
  });

  describe('PATCH', () => {
    it('should call fetch with correct parameters for PATCH request', () => {
      const httpRequest = HttpRequestMock.createPATCH();
      const { httpService, fetchSpy } = setup();

      httpService.patch<unknown>(httpRequest);

      expect(fetchSpy).toHaveBeenCalledWith(httpRequest.endpoint, {
        method: HTTP_VERBS.PATCH,
        headers: BASE_HTTP_HEADER,
        body: JSON.stringify(httpRequest.body),
      });
    });
  });

  describe('DELETE', () => {
    it('should call fetch with correct parameters for DELETE request', () => {
      const httpRequest = HttpRequestMock.createDELETE();
      const { httpService, fetchSpy } = setup();

      httpService.delete<unknown>(httpRequest);

      expect(fetchSpy).toHaveBeenCalledWith(httpRequest.endpoint, {
        method: HTTP_VERBS.DELETE,
        headers: BASE_HTTP_HEADER,
        body: JSON.stringify(httpRequest.body),
      });
    });
  });
});
