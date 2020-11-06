export interface AwaitableError {
  state: 'error';
  error: Error;
}

export interface AwaitableSuccess<T> {
  state: 'success';
  lastFetched: Date;
  data: T;
}

export interface AwaitableLoading {
  state: 'loading';
}

export type Awaitable<T> =
  | AwaitableSuccess<T>
  | AwaitableError
  | AwaitableLoading;
