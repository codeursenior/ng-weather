import { Injectable } from "@angular/core";
import { WeatherService } from "./weather.service";

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  locations: string[] = [];

  // TO-DO : Remove dependency on WeatherService
  // TO-DO : Any number of components/services can receive updates when the list of locations changes.
  constructor(private weatherService: WeatherService) {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) this.locations = JSON.parse(locString);
    for (let loc of this.locations)
      this.weatherService.addCurrentConditions(loc);
  }

  addLocation(zipcode: string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.weatherService.addCurrentConditions(zipcode);
  }

  removeLocation(zipcode: string) {
    let index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.weatherService.removeCurrentConditions(zipcode);
    }
  }
}
