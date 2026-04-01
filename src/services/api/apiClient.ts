/**
 * Shared HTTP client abstraction reserved for the future real API implementation.
 */

import type { ApiRequestOptions } from '@/types/api/common';

export interface ApiClient {
  get<TResponse>(path: string, options?: ApiRequestOptions): Promise<TResponse>;
  post<TResponse, TBody>(
    path: string,
    body: TBody,
    options?: ApiRequestOptions,
  ): Promise<TResponse>;
}

export const apiClient: ApiClient = {
  async get<TResponse>(_path: string, _options?: ApiRequestOptions) {
    throw new Error('TODO: Implement the shared API client before making network requests.');
  },
  async post<TResponse, TBody>(_path: string, _body: TBody, _options?: ApiRequestOptions) {
    throw new Error('TODO: Implement the shared API client before making network requests.');
  },
};
