import { Injectable, inject } from "@angular/core";
import { WeatherService } from "app/weather.service";
import { CurrentConditions } from "./current-conditions/current-conditions.type";
import { ConditionsAndZip } from "app/conditions-and-zip.type";
import { BehaviorSubject } from "rxjs";

type State = ConditionsAndZip[];

// TO-DO : Move code to location service
const LOCATIONS = "locations";

@Injectable({
  providedIn: "root",
})
export class MainPageFacade {
  weatherService = inject(WeatherService);

  private initialState: State = [];
  private readonly state = new BehaviorSubject<State>(this.initialState);
  private readonly state$ = this.state.asObservable();

  /* Selectors = Computed */
  conditionList$ = this.state$;

  /* Actions */
  addLocation(zipcode: string): void {
    console.log("[FACADE] addLocation : ", zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.state.value));
    this.loadConditionsByLocation(zipcode);
  }

  removeLocation(zipcode): void {
    console.log("[FACADE] removeLocation : ", zipcode);
    this.removeSomeLocation(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.state.value));
  }

  /* Reducers */
  private removeSomeLocation(zipcode): void {
    const condition = this.state.value.find(({ zip }) => zip === zipcode);

    if (!condition) {
      return;
    }

    const conditionList = this.state.value.filter(({ zip }) => zip !== zipcode);
    this.state.next(conditionList);
  }

  private setConditionsList(zip: string, data: CurrentConditions): void {
    const condition: ConditionsAndZip = { zip, data };
    const conditionsList = [...this.state.value, condition];

    console.log("[FACADE] Load conditions by location success");
    console.table(conditionsList);

    this.state.next(conditionsList);
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
