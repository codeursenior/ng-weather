import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { ConditionsAndZip } from "../../conditions-and-zip.type";
import { ConditionDetailCardComponent } from "../condition-detail-card/condition-detail-card.component";
import { TabOption } from "app/shared/tabs/tabs.component";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentConditionsComponent {
  @Input()
  set currentConditionsByZip(value: ConditionsAndZip[]) {
    this.tabOptionList = value.map((location: ConditionsAndZip) => {
      const tabOption: TabOption = {
        title: `${location.data.name} (${location.zip})`,
        component: ConditionDetailCardComponent,
        inputs: { weatherCondition: location },
      };

      console.log(tabOption);

      return tabOption;
    });
  }

  @Output() locationRemoved: EventEmitter<string> = new EventEmitter();

  tabOptionList: TabOption[];
}
