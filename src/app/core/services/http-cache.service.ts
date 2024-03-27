import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

type HttpRequestCached = {
  value: HttpResponse<unknown>;
  expiration: number;
};
@Injectable({
  providedIn: "root",
})
export class HttpCacheService {
  save(
    key: string,
    httpResponse: HttpResponse<unknown>,
    expirationInMinutes: number
  ): void {
    const httpResponseCached: HttpRequestCached = {
      value: httpResponse,
      expiration: new Date().getTime() + expirationInMinutes * 60000,
    };
    localStorage.setItem(key, JSON.stringify(httpResponseCached));
  }

  load(key: string): any | null {
    const httpResponseCachedAsString = localStorage.getItem(key);

    /* No http request was found in cache. */
    if (httpResponseCachedAsString === null) {
      return null;
    }

    /* Http request was found in cache but has timed out. */
    const response: HttpRequestCached = JSON.parse(httpResponseCachedAsString);
    const now = new Date().getTime();
    const isHttpRequestHasExpired = now > response.expiration;

    if (isHttpRequestHasExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return response.value;
  }
}
