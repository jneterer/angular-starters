import { Starter } from "./starter";

export interface PaginateStartersResponse {
  starters: Starter[];
  total: number;
};