import { Injectable } from "@angular/core";
import { WeatherService } from "./weather.service";

export const LOCATIONS: string = "locations";

// The responsability of LocationService is to act as a Cache System.
// It's used for localStorage interaction only.
// The list of current location is exposed in MainpageFace with selector locationList$.
@Injectable()
export class LocationService {
  saveLocationList(locationsList: string[]): void {
    localStorage.setItem(LOCATIONS, JSON.stringify(locationsList));
  }
}
