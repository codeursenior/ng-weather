import { ChangeDetectionStrategy, Component, Input, Type } from "@angular/core";

export type TabOption = {
  title: string;
  component: Type<any>;
  inputs: Record<string, unknown>;
};

type TabOptionList = TabOption[];

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.component.html",
  styleUrl: "./tabs.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  _tabOptionList: TabOptionList;
  currentTabSelected: TabOption | undefined;

  @Input()
  set tabOptionList(value: TabOptionList) {
    console.log("Build tabs component dynamically...");
    console.table(value);
    this._tabOptionList = value;

    /* Every time the user adds a new tab, it is automatically selected. */
    const lastIndex = value.length - 1;
    this.currentTabSelected = this._tabOptionList[lastIndex];
  }

  get tabOptionList(): TabOptionList {
    return this._tabOptionList;
  }

  openTab(index: number) {
    console.log("open tab", index);
  }

  closeTab(index: number) {
    console.log("close tab", index);
  }
}
