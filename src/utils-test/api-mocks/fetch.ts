class MockResponse {
  init: ResponseInit = {};

  body: any;

  headers?: Headers;

  status?: number;

  ok: boolean;

  constructor(body: any, init: ResponseInit = {}) {
    const { status = 0 } = init;

    this.body = body;
    this.headers = new Headers(init.headers);

    this.status = status;
    this.ok = status >= 200 && status <= 299;
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }

  text() {
    return Promise.resolve(String(this.body));
  }
}
window.Response = MockResponse as any;

window.fetch = (
  input: RequestInfo | URL, // eslint-disable-line @typescript-eslint/no-unused-vars
  init?: RequestInit, // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<Response> => Promise.resolve(new Response(null));
