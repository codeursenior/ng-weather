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
  httpCacheService = inject(HttpCacheService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.isCachable(request)) {
      return next.handle(request);
    }

    const key = this.getCacheKey(request);
    const response = this.httpCacheService.load(key);

    console.log(response);

    if (response) {
      console.log("We use cached response !");
      return of(response);
    }

    if (!response) {
      console.log("We send a request to the backend");
      return next.handle(request).pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            const key = this.getCacheKey(request);
            const twoHoursInMinutes = 120;
            console.log("EVENT BODY");
            console.log(event);
            this.httpCacheService.save(key, event, twoHoursInMinutes);
          }
        })
      );
    }
  }

  private getCacheKey(request: HttpRequest<any>): string {
    return request.urlWithParams;
  }

  private isCachable(request: HttpRequest<unknown>) {
    const isRequestGET = request.method === "GET";
    const isWeatherInfoRequest = request.url.startsWith(
      "http://api.openweathermap.org/data/2.5/weather?"
    );
    return isRequestGET && isWeatherInfoRequest;
  }
}
