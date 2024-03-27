import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { ConditionsAndZip } from "../conditions-and-zip.type";
import { ConditionDetailCardComponent } from "../condition-detail-card/condition-detail-card.component";
import { TabOption } from "app/shared/tabs/tabs.component";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentConditionsComponent {
  @Output() locationRemoved: EventEmitter<string> = new EventEmitter();
  private _currentConditionsByZip: ConditionsAndZip[];
  tabOptionList: TabOption[];

  @Input()
  set currentConditionsByZip(value: ConditionsAndZip[]) {
    this._currentConditionsByZip = value;

    this.tabOptionList = value.map((location: ConditionsAndZip) => {
      const tabOption: TabOption = {
        title: `${location.data.name} (${location.zip})`,
        component: ConditionDetailCardComponent,
        inputs: { weatherCondition: location },
      };

      return tabOption;
    });
  }

  onTabClose(index: number): void {
    const location = this._currentConditionsByZip[index].zip;
    this.locationRemoved.emit(location);
  }
}
