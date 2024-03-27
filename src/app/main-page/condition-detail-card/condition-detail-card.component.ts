import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from "@angular/core";
import { Router } from "@angular/router";
import { ConditionsAndZip } from "app/main-page/conditions-and-zip.type";
import { WeatherIconService } from "app/core/services/weather-icon.service";

@Component({
  selector: "app-condition-detail-card",
  templateUrl: "./condition-detail-card.component.html",
  styleUrl: "./condition-detail-card.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionDetailCardComponent {
  @Input({ required: true }) weatherCondition: ConditionsAndZip;
  private readonly router = inject(Router);
  readonly weatherIconService = inject(WeatherIconService);

  showForecast(zipcode: string) {
    this.router.navigate(["/forecast", zipcode]);
  }
}
