import { ISearchResult } from './isearch-result';

export interface IGlobalSearchResult {
  _id: 'starter' | 'theme' | 'site';
  avgScore: number;
  results: ISearchResult[];
}