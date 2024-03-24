import { Component, inject } from "@angular/core";
import { MainPageFacade } from "./main-page.facade";

@Component({
  /* Page component don't need selector for template cause we use Router instead. */
  templateUrl: "./main-page.component.html",
  /* We provide a facade only for a dedicated page component. */
  providers: [MainPageFacade],
})
export class MainPageComponent {
  readonly facade = inject(MainPageFacade);
}
