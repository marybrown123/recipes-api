/* eslint-disable @typescript-eslint/no-unused-vars */
import { Cache, Store } from 'cache-manager';

export class CacheServiceMock implements Cache {
  set: (key: string, value: unknown, ttl?: number) => Promise<void>;
  get: <T>(key: string) => Promise<T>;
  del: (key: string) => Promise<void>;
  reset: () => Promise<void>;
  wrap<T>(_key: string, _fn: () => Promise<T>, _ttl?: number): Promise<T> {
    throw new Error('Method not implemented.');
  }
  store: Store;
}
