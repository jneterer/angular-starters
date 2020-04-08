import { IHighlight } from './ihighlight';

export interface ISearchResult {
  name: string;
  description?: string;
  categories?: string[];
  demo_url?: 1,
  repo_url?: 1,
  score: number;
  highlights?: IHighlight[];
}