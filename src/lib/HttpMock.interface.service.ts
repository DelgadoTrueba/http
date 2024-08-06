import { HttpInterfaceService } from './Http.interface.service';
import { HttpBody } from './model/shared/HttpBody.model';
import { HttpHeader } from './model/shared/HttpHeader.model';

export interface MockAdapterResponseFncParams {
  params?: Record<string /* id */, string /* value */>;
  body?: HttpBody;
  headers?: HttpHeader;
}

export interface MockAdapterResponseFncReturn<T> {
  response: T;
  status: number;
  headers?: Headers;
}

export type MockAdapterResponseFnc<T> = (
  params: MockAdapterResponseFncParams,
) => Promise<MockAdapterResponseFncReturn<T>>;

export abstract class HttpInterfaceMockAdapter extends HttpInterfaceService {
  abstract onGet<T>(
    urlPattern: string,
    mockFnc: MockAdapterResponseFnc<T>,
  ): void;
  abstract onPost<T>(
    urlPattern: string,
    mockFnc: MockAdapterResponseFnc<T>,
  ): void;
  abstract onPut<T>(
    urlPattern: string,
    mockFnc: MockAdapterResponseFnc<T>,
  ): void;
  abstract onDelete<T>(
    urlPattern: string,
    mockFnc: MockAdapterResponseFnc<T>,
  ): void;
  abstract onPatch<T>(
    urlPattern: string,
    mockFnc: MockAdapterResponseFnc<T>,
  ): void;
}
