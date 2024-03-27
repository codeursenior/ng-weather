import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CurrentConditions } from "../../main-page/current-conditions/current-conditions.type";
import { Forecast } from "../../forecasts-list/forecast.type";
import { tap } from "rxjs/operators";

/* WeatherService service is for HTTP calls only.*/
@Injectable()
export class WeatherService {
  static URL = "http://api.openweathermap.org/data/2.5";
  static APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";
  private readonly http = inject(HttpClient);

  fetchConditionsByLocation(zipcode: string): Observable<CurrentConditions> {
    const baseUrl = `${WeatherService.URL}/weather`;
    const queryParams = `?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`;

    return this.http.get<CurrentConditions>(`${baseUrl}${queryParams}`);
  }

  fetchForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );
  }
}
