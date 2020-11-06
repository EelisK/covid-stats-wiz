import { Injectable } from '@angular/core';
import {
  Awaitable,
  AwaitableError,
  AwaitableLoading,
  AwaitableSuccess,
} from './models/awaitable.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  public isLoading(awaitable?: Awaitable<any>): awaitable is AwaitableLoading {
    return awaitable?.state === 'loading';
  }

  public isError(awaitable?: Awaitable<any>): awaitable is AwaitableError {
    return awaitable?.state === 'error';
  }

  public isSuccess<T>(
    awaitable?: Awaitable<T>
  ): awaitable is AwaitableSuccess<T> {
    return awaitable?.state === 'success';
  }
}
