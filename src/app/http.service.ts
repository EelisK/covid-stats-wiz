import { Injectable } from '@angular/core';

export interface HttpClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: Data): Promise<T>;
}

export type Data = Record<string, any>;
export type HttpMethod = keyof HttpClient;

export interface RequestProps {
  method: HttpMethod;
  body?: Data;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor() {}

  private static readonly defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  public async get<T>(path: string): Promise<T> {
    return await this.request<T>(path, { method: 'get' });
  }

  public async post<T>(path: string, body: Data): Promise<T> {
    return await this.request<T>(path, { method: 'post', body });
  }

  private async request<T>(path: string, props: RequestProps): Promise<T> {
    const req = await fetch(path, {
      headers: HttpService.defaultHeaders,
      body: props.body && JSON.stringify(props.body),
      method: props.method,
    });
    const response = await req.json();
    if (!req.ok) {
      throw new Error(response.detail);
    }
    return response;
  }
}
