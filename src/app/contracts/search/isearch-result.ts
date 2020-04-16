import { IHighlight } from './ihighlight';

export interface ISearchResult {
  angular_version: string;
  categories?: string[];
  demo_url?: 1,
  description?: string;
  highlights?: IHighlight[];
  name: string;
  repo_url?: 1,
  score: number;
}