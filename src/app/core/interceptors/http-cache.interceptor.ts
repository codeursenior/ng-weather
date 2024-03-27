import { Injectable, inject } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { HttpCacheService } from "../services/http-cache.service";
import { tap } from "rxjs/operators";
import { WeatherService } from "../services/weather.service";

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  private readonly httpCacheService = inject(HttpCacheService);
  private static readonly EXPIRATION_TIME_IN_MINUTES = 120;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    /* Check if current request is cacheable. */
    if (!this.isCacheable(request)) {
      return next.handle(request);
    }

    const key = this.getCacheKey(request);
    const response: HttpResponse<unknown> | null =
      this.httpCacheService.load(key);

    /* Return cached http response. */
    if (response) {
      console.info(`We use cached response for request ${key}`);
      return of(new HttpResponse({ body: response.body, status: 200 }));
    }

    /* Send http request to the backend and put the response in cache. */
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          console.info(`We send to the backend the request ${key}`);
          this.httpCacheService.save(
            key,
            event,
            HttpCacheInterceptor.EXPIRATION_TIME_IN_MINUTES
          );
        }
      })
    );
  }

  /* Determine unique key for a given request. */
  private getCacheKey(request: HttpRequest<any>): string {
    return request.urlWithParams;
  }

  /* Determine if a given request is cachable. */
  private isCacheable(request: HttpRequest<unknown>): boolean {
    const isRequestGET = request.method === "GET";
    const isWeatherInfoRequest = request.url.startsWith(WeatherService.URL);
    return isRequestGET && isWeatherInfoRequest;
  }
}
