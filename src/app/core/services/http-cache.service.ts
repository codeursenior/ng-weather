import { Injectable } from "@angular/core";

type HttpRequestCached = {
  key: string;
  response: unknown;
  expiration: number;
};
@Injectable({
  providedIn: "root",
})
export class HttpCacheService {
  save(key: string, data: any, expirationInMinutes: number): void {
    const record = {
      value: data,
      expiration: new Date().getTime() + expirationInMinutes * 60000,
    };
    localStorage.setItem(key, JSON.stringify(record));
  }

  load(key: string): any | null {
    const item = localStorage.getItem(key);

    /* No http request was found in cache. */
    if (item === null) {
      return null;
    }

    /* Http request was found in cache but has timed out. */
    const record = JSON.parse(item);
    const now = new Date().getTime();
    const isHttpRequestHasExpired = now > record.expiration;

    if (isHttpRequestHasExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return record.value;
  }
}
