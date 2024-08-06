/* eslint-disable @typescript-eslint/dot-notation  */

import { BASE_HTTP_HEADER, HttpMockService } from './HttpMock.service';
import { HttpResponse } from './model/response/HttpResponse.model';
import { HttpStatusResponse } from './model/response/HttpStatusCodeResponse.model';

import { HTTP_VERBS, HttpRequest } from './model/request/HttpRequest.model';
import { HttpRequestUrlMock } from './model/request/mocks/HttpRequestUrl.mock';
import { HttpResponseMock } from './model/response/mocks/HttpResponse.mock';
import { MockAdapterResponseFnc } from './HttpMock.interface.service';
import { HttpRequestMock } from './model/request/mocks/HttpRequest.mock';
import { HttpResponseError } from './model/response/HttpResponseError.model';

export function getPathname(url: string): string {
  const urlObject = new URL(url);
  return urlObject.pathname;
}

interface Pet {
  id: number;
  name: string;
  type: 'Dog' | 'Cat';
}

const setup = (
  method: HTTP_VERBS = HTTP_VERBS.GET,
  httpRequest: HttpRequest = HttpRequestMock.create(),
  httpResponse: HttpResponse<unknown> = HttpResponseMock.create(),
) => {
  const httpMockService = new HttpMockService();

  const mockAdapterFnc: MockAdapterResponseFnc<Pet> = async () => {
    const response = {
      status: httpResponse.status,
      response: await httpResponse.json(),
      headers: httpResponse.headers,
    };

    if (httpResponse.status >= 200 && httpResponse.status <= 299) {
      return Promise.resolve(response);
    }
    return Promise.reject(response);
  };
  const mockAdapterFncSpy = jest.fn().mockImplementation(mockAdapterFnc);

  switch (method) {
    case HTTP_VERBS.GET:
      httpMockService.onGet(httpRequest.endpoint, mockAdapterFncSpy);
      break;
    case HTTP_VERBS.POST:
      httpMockService.onPost(httpRequest.endpoint, mockAdapterFncSpy);
      break;
    case HTTP_VERBS.PUT:
      httpMockService.onPut(httpRequest.endpoint, mockAdapterFncSpy);
      break;
    case HTTP_VERBS.PATCH:
      httpMockService.onPatch(httpRequest.endpoint, mockAdapterFncSpy);
      break;
    case HTTP_VERBS.DELETE:
      httpMockService.onDelete(httpRequest.endpoint, mockAdapterFncSpy);
      break;
    default:
      httpMockService.onGet(httpRequest.endpoint, mockAdapterFncSpy);
      break;
  }

  return {
    httpMockService,
    mockAdapterFncSpy,
  };
};

describe('HttpMockService', () => {
  let mock!: Pet;

  beforeEach(() => {
    mock = {
      id: 1,
      name: 'Shena',
      type: 'Dog',
    };
  });

  it('should run constructor()', () => {
    const { httpMockService } = setup();
    expect(httpMockService).toBeTruthy();
  });

  describe('GET', () => {
    it('should prepare data mock form GET request', () => {
      const { httpMockService } = setup();
      const endpoint = HttpRequestUrlMock.create();

      httpMockService.onGet(endpoint.url, () => {
        return Promise.resolve({
          status: 200,
          response: mock,
        });
      });

      const mockResponsesGet = httpMockService?.[
        'mockResponsesGet'
      ] as unknown as Map<string, MockAdapterResponseFnc<any>>;

      expect(mockResponsesGet.size).toBe(1);
      expect(mockResponsesGet.get(getPathname(endpoint.url))).toBeTruthy();
    });

    it('should simulate fetch call with correct parameters for GET request', async () => {
      // Arrange
      const httpRequest = HttpRequestMock.createGET();
      const httpResponse = HttpResponseMock.createOK({ body: mock });

      const { httpMockService, mockAdapterFncSpy } = setup(
        HTTP_VERBS.GET,
        httpRequest,
        httpResponse,
      );

      // Act
      await httpMockService.get(httpRequest);

      // Assert
      expect(mockAdapterFncSpy).toHaveBeenCalledWith({
        params: {},
        headers: BASE_HTTP_HEADER,
        body: undefined,
      });
    });

    it('should simulate fetch call with correct parameters for GET request wit HEADERS', async () => {
      // Arrange
      const httpRequest = HttpRequestMock.createGETWithHeaders({
        headers: {
          'X-App-Version': '1.0',
        },
      });
      const httpResponse = HttpResponseMock.createOK({ body: mock });

      const { httpMockService, mockAdapterFncSpy } = setup(
        HTTP_VERBS.GET,
        httpRequest,
        httpResponse,
      );

      // Act
      await httpMockService.get(httpRequest);

      // Assert
      expect(mockAdapterFncSpy).toHaveBeenCalledWith({
        params: {},
        headers: { ...BASE_HTTP_HEADER, ...httpRequest.headers },
        body: undefined,
      });
    });

    it('should simulate fetch call with correct parameters for GET request with PATH PARAMS', async () => {
      // Arrange
      const endpoint = HttpRequestUrlMock.createWitchQueryParams({
        url: 'http://localhost:3001/test/:id',
      });
      const httpRequest = HttpRequestMock.createGET({ endpoint: endpoint.url });
      const httpResponse = HttpResponseMock.createOK({ body: mock });

      const { httpMockService, mockAdapterFncSpy } = setup(
        HTTP_VERBS.GET,
        httpRequest,
        httpResponse,
      );

      // Act
      await httpMockService.get({
        ...httpRequest,
        endpoint: httpRequest.endpoint.replace(':id', '1'),
      });

      // Assert
      expect(mockAdapterFncSpy).toHaveBeenCalledWith({
        params: {
          id: '1',
        },
        headers: BASE_HTTP_HEADER,
        body: undefined,
      });
    });

    it('should simulate fetch call with correct parameters for GET request with QUERY PARAMS', async () => {
      // Arrange
      const endpoint = HttpRequestUrlMock.createWitchQueryParams({
        url: 'http://localhost:3001/test?sort=:sort',
      });
      const httpRequest = HttpRequestMock.createGET({ endpoint: endpoint.url });
      const httpResponse = HttpResponseMock.createOK({ body: mock });

      const { httpMockService, mockAdapterFncSpy } = setup(
        HTTP_VERBS.GET,
        httpRequest,
        httpResponse,
      );

      // Act
      await httpMockService.get({
        ...httpRequest,
        endpoint: httpRequest.endpoint.replace(':sort', 'ASC'),
      });

      // Assert
      expect(mockAdapterFncSpy).toHaveBeenCalledWith({
        params: {
          sort: 'ASC',
        },
        headers: BASE_HTTP_HEADER,
        body: undefined,
      });
    });

    it('should simulate fetch call with correct parameters for GET request with PATH PARAMS and QUERY PARAMS', async () => {
      // Arrange
      const endpoint = HttpRequestUrlMock.createWitchQueryParams({
        url: 'http://localhost:3001/test/:id?sort=:sort',
      });
      const httpRequest = HttpRequestMock.createGET({ endpoint: endpoint.url });
      const httpResponse = HttpResponseMock.createOK({ body: mock });

      const { httpMockService, mockAdapterFncSpy } = setup(
        HTTP_VERBS.GET,
        httpRequest,
        httpResponse,
      );

      // Act
      await httpMockService.get({
        ...httpRequest,
        endpoint: httpRequest.endpoint
          .replace(':id', '1')
          .replace(':sort', 'ASC'),
      });

      // Assert
      expect(mockAdapterFncSpy).toHaveBeenCalledWith({
        params: {
          id: '1',
          sort: 'ASC',
        },
        headers: BASE_HTTP_HEADER,
        body: undefined,
      });
    });

    it('should simulate fetch call (status >= 200 && status <= 299) and return correct mock for GET', async () => {
      // Arrange
      const httpRequest = HttpRequestMock.createGET({
        endpoint: 'http://localhost:3001/test',
      });
      const httpResponse = HttpResponseMock.createOK({ body: mock });

      const { httpMockService } = setup(
        HTTP_VERBS.GET,
        httpRequest,
        httpResponse,
      );

      // Act
      const response = await httpMockService.get({
        ...httpRequest,
      });

      // Assert
      expect(response.status).toBe(HttpStatusResponse.OK);
      expect(await response.json()).toEqual(mock);
    });

    it('should simulate fetch error call (status < 200 || status > 299) and return correct mock for GET', async () => {
      // Arrange
      const httpRequest = HttpRequestMock.createGET({
        endpoint: 'http://localhost:3001/test',
      });
      const internalServerErrorMock = {
        msg: 'Internal Server Error',
      };
      const httpResponse = HttpResponseMock.createInternalServerError({
        body: internalServerErrorMock,
      });

      const { httpMockService } = setup(
        HTTP_VERBS.GET,
        httpRequest,
        httpResponse,
      );

      // Act
      let thrownError!: HttpResponseError<unknown>;
      try {
        await httpMockService.get({
          ...httpRequest,
        });
      } catch (error) {
        if (error instanceof HttpResponseError) {
          thrownError = error;
        }
      }

      // Assert
      expect(thrownError.response.status).toBe(
        HttpStatusResponse.INTERNAL_SERVER_ERROR,
      );
      expect(await thrownError.response.json()).toEqual(
        internalServerErrorMock,
      );
    });

    it('should throw error if mock if not defined for GET', async () => {
      // Arrange
      const httpRequest = HttpRequestMock.createGET({
        endpoint: 'http://localhost:3001/test',
      });
      const httpResponse = HttpResponseMock.createOK({ body: mock });

      const { httpMockService } = setup(
        HTTP_VERBS.GET,
        httpRequest,
        httpResponse,
      );

      // Act
      let thrownError!: Error;
      try {
        await httpMockService.get({
          ...httpRequest,
          endpoint: 'http://localhost:3001/test-invalid',
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          thrownError = error;
        }
      }

      // Assert
      expect.assertions(1);
      expect(thrownError.message).toEqual('No mock response for URL');
    });
  });

  describe('POST', () => {
    it('should prepare data mock form POST request', () => {
      const { httpMockService } = setup();
      const endpoint = HttpRequestUrlMock.create();

      httpMockService.onPost(endpoint.url, () => {
        return Promise.resolve({
          status: 200,
          response: mock,
        });
      });

      const mockResponsesPOST = httpMockService?.[
        'mockResponsesPost'
      ] as unknown as Map<string, MockAdapterResponseFnc<any>>;

      expect(mockResponsesPOST.size).toBe(1);
      expect(mockResponsesPOST.get(getPathname(endpoint.url))).toBeTruthy();
    });

    it('should simulate fetch call with correct parameters for POST request', async () => {
      // Arrange
      const httpRequest = HttpRequestMock.createPOST();
      const httpResponse = HttpResponseMock.createOK({ body: mock });

      const { httpMockService, mockAdapterFncSpy } = setup(
        HTTP_VERBS.POST,
        httpRequest,
        httpResponse,
      );

      // Act
      await httpMockService.post(httpRequest);

      // Assert
      expect(mockAdapterFncSpy).toHaveBeenCalledWith({
        params: {},
        headers: BASE_HTTP_HEADER,
        body: JSON.stringify(httpRequest.body),
      });
    });
  });

  describe('PUT', () => {
    it('should prepare data mock form PUT request', () => {
      const { httpMockService } = setup();
      const endpoint = HttpRequestUrlMock.create();

      httpMockService.onPut(endpoint.url, () => {
        return Promise.resolve({
          status: 200,
          response: mock,
        });
      });

      const mockResponsesPUT = httpMockService?.[
        'mockResponsesPut'
      ] as unknown as Map<string, MockAdapterResponseFnc<any>>;

      expect(mockResponsesPUT.size).toBe(1);
      expect(mockResponsesPUT.get(getPathname(endpoint.url))).toBeTruthy();
    });

    it('should simulate fetch call with correct parameters for PUT request', async () => {
      // Arrange
      const httpRequest = HttpRequestMock.createPUT();
      const httpResponse = HttpResponseMock.createOK({ body: mock });

      const { httpMockService, mockAdapterFncSpy } = setup(
        HTTP_VERBS.PUT,
        httpRequest,
        httpResponse,
      );

      // Act
      await httpMockService.put(httpRequest);

      // Assert
      expect(mockAdapterFncSpy).toHaveBeenCalledWith({
        params: {},
        headers: BASE_HTTP_HEADER,
        body: JSON.stringify(httpRequest.body),
      });
    });
  });

  describe('PATCH', () => {
    it('should prepare data mock form PATCH request', () => {
      const { httpMockService } = setup();
      const endpoint = HttpRequestUrlMock.create();

      httpMockService.onPatch(endpoint.url, () => {
        return Promise.resolve({
          status: 200,
          response: mock,
        });
      });

      const mockResponsesPATCH = httpMockService?.[
        'mockResponsesPatch'
      ] as unknown as Map<string, MockAdapterResponseFnc<any>>;

      expect(mockResponsesPATCH.size).toBe(1);
      expect(mockResponsesPATCH.get(getPathname(endpoint.url))).toBeTruthy();
    });

    it('should simulate fetch call with correct parameters for PATCH request', async () => {
      // Arrange
      const httpRequest = HttpRequestMock.createPATCH();
      const httpResponse = HttpResponseMock.createOK({ body: mock });

      const { httpMockService, mockAdapterFncSpy } = setup(
        HTTP_VERBS.PATCH,
        httpRequest,
        httpResponse,
      );

      // Act
      await httpMockService.patch(httpRequest);

      // Assert
      expect(mockAdapterFncSpy).toHaveBeenCalledWith({
        params: {},
        headers: BASE_HTTP_HEADER,
        body: JSON.stringify(httpRequest.body),
      });
    });
  });

  describe('DELETE', () => {
    it('should prepare data mock form DELETE request', () => {
      const { httpMockService } = setup();
      const endpoint = HttpRequestUrlMock.create();

      httpMockService.onDelete(endpoint.url, () => {
        return Promise.resolve({
          status: 200,
          response: mock,
        });
      });

      const mockResponsesDELETE = httpMockService?.[
        'mockResponsesDelete'
      ] as unknown as Map<string, MockAdapterResponseFnc<any>>;

      expect(mockResponsesDELETE.size).toBe(1);
      expect(mockResponsesDELETE.get(getPathname(endpoint.url))).toBeTruthy();
    });

    it('should simulate fetch call with correct parameters for DELETE request', async () => {
      // Arrange
      const httpRequest = HttpRequestMock.createDELETE();
      const httpResponse = HttpResponseMock.createOK({ body: mock });

      const { httpMockService, mockAdapterFncSpy } = setup(
        HTTP_VERBS.DELETE,
        httpRequest,
        httpResponse,
      );

      // Act
      await httpMockService.delete(httpRequest);

      // Assert
      expect(mockAdapterFncSpy).toHaveBeenCalledWith({
        params: {},
        headers: BASE_HTTP_HEADER,
        body: JSON.stringify(httpRequest.body),
      });
    });
  });
});
