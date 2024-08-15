import { HttpResponse } from './HttpResponse.model';

// TODO
// status < 200 && status > 299
export class HttpResponseError<T> extends Error {
  response: HttpResponse<T>;

  constructor(res: HttpResponse<T>) {
    super('Invalid http response status < 200 || status > 299');
    this.response = res;
    this.name = 'HttpResponseError';
  }
}
