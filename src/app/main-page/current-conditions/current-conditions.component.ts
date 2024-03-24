import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { WeatherService } from "../../weather.service";
import { Router } from "@angular/router";
import { ConditionsAndZip } from "../../conditions-and-zip.type";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
})
export class CurrentConditionsComponent {
  @Input() currentConditionsByZip: ConditionsAndZip[] = [];
  @Output() locationRemoved: EventEmitter<string> = new EventEmitter();

  private weatherService = inject(WeatherService);

  private router = inject(Router);
  showForecast(zipcode: string) {
    this.router.navigate(["/forecast", zipcode]);
  }
}
