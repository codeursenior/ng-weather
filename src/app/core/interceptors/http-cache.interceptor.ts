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

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  private readonly httpCacheService = inject(HttpCacheService);
  private static readonly EXPIRATION_TIME_IN_MINUTES = 120;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.isCacheable(request)) {
      return next.handle(request);
    }

    const key = this.getCacheKey(request);
    const response: HttpResponse<unknown> | null =
      this.httpCacheService.load(key);

    if (response) {
      console.info(`We use cached response for request ${key}`);
      return of(new HttpResponse({ body: response.body, status: 200 }));
    }

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          console.log(`We send to the backend the request ${key}`);
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
    const isWeatherInfoRequest = request.url.startsWith(
      "http://api.openweathermap.org/data/2.5/weather?"
    );
    return isRequestGET && isWeatherInfoRequest;
  }
}
