import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { CacheService } from "../services/http-cache.service";

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const cachedResponse = this.cacheService.load(this.getCacheKey(req));
    if (cachedResponse) {
      return of(cachedResponse);
    } else {
      return next.handle(req);
    }
  }

  getCacheKey(req: HttpRequest<any>): string {
    const url = req.urlWithParams;
    return url;
  }
}
