import { Component, OnInit, inject } from "@angular/core";
import { WeatherService } from "../core/services/weather.service";
import { ActivatedRoute, ParamMap, Params } from "@angular/router";
import { Forecast } from "./forecast.type";
import { filter, map, switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { WeatherIconService } from "app/core/services/weather-icon.service";

@Component({
  selector: "app-forecasts-list",
  templateUrl: "./forecasts-list.component.html",
  styleUrls: ["./forecasts-list.component.css"],
})
export class ForecastsListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly weatherService = inject(WeatherService);
  private readonly weatherIconService = inject(WeatherIconService);
  forecast$: Observable<Forecast>;

  /* Use reactive implementation to avoid handling unsubscription with Async pipe. */
  ngOnInit(): void {
    this.forecast$ = this.route.paramMap.pipe(
      filter((params: ParamMap) => params.has("zipcode")),
      map((params: ParamMap) => params.get("zipcode")),
      switchMap((zipcode: string) => this.weatherService.fetchForecast(zipcode))
    );
  }
}
