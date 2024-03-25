import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { ZipcodeEntryComponent } from "./main-page/zipcode-entry/zipcode-entry.component";
import { ForecastsListComponent } from "./forecasts-list/forecasts-list.component";
import { WeatherService } from "./weather.service";
import { CurrentConditionsComponent } from "./main-page/current-conditions/current-conditions.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { RouterModule } from "@angular/router";
import { routing } from "./app.routing";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { TabsComponent } from "./shared/tabs/tabs.component";
import { ConditionDetailCardComponent } from "./main-page/condition-detail-card/condition-detail-card.component";
import { HttpCacheInterceptor } from "./core/interceptors/http-cache.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
    ConditionDetailCardComponent,
    TabsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  providers: [
    WeatherService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCacheInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
