interface HttpRequestUrl {
  url: string;
  queryParams: string[][];
}

const createHttpRequestUrlMock = (params: Partial<HttpRequestUrl> = {}) => {
  return {
    url: params.url ?? 'http://localhost:3001/test',
    queryParams: params.queryParams ?? [],
  };
};

export const HttpRequestUrlMock = {
  create: (params?: Partial<HttpRequestUrl>) => {
    return createHttpRequestUrlMock(params);
  },
  createWitchQueryParams: (params?: Partial<HttpRequestUrl>) => {
    return createHttpRequestUrlMock({
      url: 'http://localhost:3001/test?sort=:sort',
      ...params,
    });
  },
};
