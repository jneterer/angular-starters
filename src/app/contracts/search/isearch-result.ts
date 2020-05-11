import { IHighlight } from './ihighlight';

export interface ISearchResult {
  angular_version: string;
  categories?: string[];
  demo_url?: 1,
  description?: string;
  features?: string[];
  highlights?: IHighlight[];
  name: string;
  owner?: string;
  repo_url?: 1,
  score: number;
  type: ('starter' | 'theme' | 'site');
}