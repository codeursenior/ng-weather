import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from "@angular/core";
import { ConditionsAndZip } from "app/conditions-and-zip.type";
import { WeatherService } from "app/weather.service";

@Component({
  selector: "app-condition-detail-card",
  templateUrl: "./condition-detail-card.component.html",
  styleUrl: "./condition-detail-card.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionDetailCardComponent {
  @Input() weatherCondition: ConditionsAndZip;

  weatherService = inject(WeatherService);
}
