import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from "@angular/core";

type TabOption = {
  title: string;
  component: Component;
  inputs: { [key: string]: unknown };
};

type TabOptionList = TabOption[];

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.component.html",
  styleUrl: "./tabs.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  @Input() tabOptionList: TabOptionList = [];
  // stuff = input(0);
  currentIndexTabSelected = signal(0);

  openTab(index: number) {
    console.log("open tab", index);
  }

  closeTab(index: number) {
    console.log("close tab", index);
  }

  isTabOptionListDisplayed() {
    return this.tabOptionList.length > 0;
  }
}
