import { Injectable, inject } from "@angular/core";
import { WeatherService } from "app/weather.service";
import { CurrentConditions } from "./current-conditions/current-conditions.type";
import { ConditionsAndZip } from "app/conditions-and-zip.type";
import { BehaviorSubject } from "rxjs";
import { LocationService } from "app/location.service";
import { map } from "rxjs/operators";

type State = ConditionsAndZip[];

// TO-DO : Move code to location service
const LOCATIONS = "locations";

@Injectable({
  providedIn: "root",
})
export class MainPageFacade {
  locationService = inject(LocationService);
  weatherService = inject(WeatherService);

  private initialState: State = [];
  private readonly state = new BehaviorSubject<State>(this.initialState);
  readonly state$ = this.state.asObservable();

  /* Selectors = Computed */
  locationList$ = this.state$.pipe(map((state) => state.map(({ zip }) => zip)));

  /* Actions */
  addLocation(zipcode: string): void {
    /* We choose not to allow the same location to be added twice. */
    const isLocationAlreadyLoaded = this.state.value
      .map(({ zip }) => zip)
      .includes(zipcode);
    if (isLocationAlreadyLoaded) {
      return;
    }

    this.loadConditionsByLocation(zipcode);
  }

  removeLocation(zipcode): void {
    this.removeSomeLocation(zipcode);
  }

  /* Reducers */
  private removeSomeLocation(zipcode): void {
    const condition = this.state.value.find(({ zip }) => zip === zipcode);

    if (!condition) {
      return;
    }

    const conditionList = this.state.value.filter(({ zip }) => zip !== zipcode);
    this.locationService.saveLocationList(conditionList.map(({ zip }) => zip));
    this.state.next(conditionList);
  }

  private setConditionsList(zip: string, data: CurrentConditions): void {
    const condition: ConditionsAndZip = { zip, data };
    const conditionList = [...this.state.value, condition];
    this.locationService.saveLocationList(conditionList.map(({ zip }) => zip));
    this.state.next(conditionList);
  }

  /* Side effects */
  private loadConditionsByLocation(zipcode: string): void {
    this.weatherService
      .fetchConditionsByLocation(zipcode)
      .subscribe((data: CurrentConditions) => {
        this.setConditionsList(zipcode, data);
      });
  }
}
