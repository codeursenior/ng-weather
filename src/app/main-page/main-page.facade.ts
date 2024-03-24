import { Injectable, WritableSignal, inject, signal } from "@angular/core";
import { WeatherService } from "app/weather.service";
import { CurrentConditions } from "./current-conditions/current-conditions.type";
import { ConditionsAndZip } from "app/conditions-and-zip.type";
import { zip } from "rxjs";

type State = {
  locationList: string[]; // zipcode
  conditionsList: ConditionsAndZip[]; // zipcode + current conditions
};

const LOCATIONS = "locations";

@Injectable()
export class MainPageFacade {
  weatherService = inject(WeatherService);
  
  private initialState: State = { locationList: [], conditionsList: [] };
  private readonly state: WritableSignal<State> = signal<State>(
    this.initialState
  );

  /* Selectors = Computed */

  /* Actions */
  addLocation(zipcode: string): void {
    console.log("[FACADE] addLocation : ", zipcode);
    this.state.update((state) => {
      const newState = this.setAdditionalLocation(state, zipcode);
      localStorage.setItem(LOCATIONS, JSON.stringify(state.locationList));
      this.loadConditionsByLocation(zipcode);
      return newState;
    });
  }

  removeLocation(zipcode): void {
    this.state.update((state) => {
      const newState = this.removeSomeLocation(state, zipcode);
      localStorage.setItem(LOCATIONS, JSON.stringify(state.locationList));
      return newState;
    });
  }

  /* Reducers */
  private setAdditionalLocation(state, zipcode): State {
    const locationList = [...state.locationList, zipcode];
    return { ...state, locationList };
  }

  private removeSomeLocation(state, zipcode): State {
    const index = state.locationList.indexOf(zipcode);
    const locationList = state.locationList.splice(index, 1);

    let conditionsList = state.conditionsList;
    for (let i in conditionsList) {
      if (conditionsList[i].zip == zipcode) {
        conditionsList = conditionsList.splice(+i, 1);
      }
    }

    return { ...state, locationList, conditionsList };
  }

  private setConditionsList(
    state: State,
    zipcode: string,
    data: CurrentConditions
  ): State {
    const newCondition: ConditionsAndZip = { zip: zipcode, data };
    const conditionsList = [...state.conditionsList, newCondition];
    return { ...state, conditionsList };
  }

  /* Side effects */
  loadConditionsByLocation(zipcode: string): void {
    this.weatherService
      .fetchConditionsByLocation(zipcode)
      .subscribe((data: CurrentConditions) => {
        this.setConditionsList(this.state(), zipcode, data);
      });
  }
}
