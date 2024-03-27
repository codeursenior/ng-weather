import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Type,
} from "@angular/core";

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

  @Output() tabClosed = new EventEmitter<number>();

  @Input()
  set tabOptionList(value: TabOptionList) {
    this._tabOptionList = value;

    /* Every time the user adds a new tab, it is automatically selected. */
    const lastIndex = value.length - 1;
    this.currentTabSelected = this._tabOptionList[lastIndex];
  }

  get tabOptionList(): TabOptionList {
    return this._tabOptionList;
  }

  openTab(index: number) {
    this.currentTabSelected = this._tabOptionList[index];
  }

  closeTab(index: number) {
    this.tabClosed.emit(index);

    /* If there is only one tab available, we don't want to display anything to the user. */
    if (this.tabOptionList.length === 1) {
      this.currentTabSelected = undefined;
      this._tabOptionList = [];
      return;
    }

    /* If the user closes the rightmost tab. */
    const lastIndex = this.tabOptionList.length - 1;
    const isLastIndex = lastIndex === index;
    if (isLastIndex) {
      this.currentTabSelected = this.tabOptionList[lastIndex - 1];
      this.removeLastTab();
      return;
    }

    /* If there are more than 2 tabs and the user does not close the last one, we display the next one. */
    this.currentTabSelected = this.tabOptionList[index + 1];
    this.removeTabAtIndex(index);
  }

  private removeLastTab() {
    this._tabOptionList.pop();
  }

  private removeTabAtIndex(index: number) {
    /* Remove one tab at the specified index. */
    this._tabOptionList.splice(index, 1);
  }
}
