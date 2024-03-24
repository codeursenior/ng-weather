import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from "@angular/core";
import { WeatherService } from "../../weather.service";
import { Router } from "@angular/router";
import { ConditionsAndZip } from "../../conditions-and-zip.type";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentConditionsComponent {
  @Input() currentConditionsByZip: ConditionsAndZip[];
  @Output() locationRemoved: EventEmitter<string> = new EventEmitter();

  weatherService = inject(WeatherService);

  private router = inject(Router);
  showForecast(zipcode: string) {
    this.router.navigate(["/forecast", zipcode]);
  }

  get tabTitleList(): string[] {
    return this.currentConditionsByZip.map(({ zip }) => zip);
  }
}
