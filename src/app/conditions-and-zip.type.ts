import { CurrentConditions } from "./main-page/current-conditions/current-conditions.type";

export interface ConditionsAndZip {
  zip: string;
  data: CurrentConditions;
}
