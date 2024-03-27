import { Injectable, inject } from "@angular/core";
import { WeatherService } from "app/core/services/weather.service";
import { CurrentConditions } from "./current-conditions/current-conditions.type";
import { ConditionsAndZip } from "app/main-page/conditions-and-zip.type";
import { BehaviorSubject } from "rxjs";

type State = ConditionsAndZip[];

@Injectable({
  providedIn: "root",
})
export class MainPageFacade {
  weatherService = inject(WeatherService);

  private readonly state = new BehaviorSubject<State>([]);
  readonly state$ = this.state.asObservable();

  /* Actions */
  addLocation(zipcode: string): void {
    const isLocationAlreadyLoaded = this.state.value
      .map(({ zip }) => zip)
      .includes(zipcode);

    /* We choose not to allow the same location to be added twice. */
    if (isLocationAlreadyLoaded) {
      return;
    }

    this.loadConditionsByLocation(zipcode);
  }

  removeLocation(zipcode): void {
    const conditionList = this.state.value.filter(({ zip }) => zip !== zipcode);
    this.state.next(conditionList);
  }

  /* Side effects */
  private loadConditionsByLocation(zipcode: string): void {
    this.weatherService.fetchConditionsByLocation(zipcode).subscribe(
      (data: CurrentConditions) => {
        // this.setConditionsList(zipcode, data);
        const condition: ConditionsAndZip = { zip: zipcode, data };
        const conditionList = [...this.state.value, condition];
        this.state.next(conditionList);
      },
      () => {
        console.error(`No data where found for given zipcode : ${zipcode}`);
      }
    );
  }
}
