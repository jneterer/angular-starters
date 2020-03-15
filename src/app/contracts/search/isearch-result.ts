import { IHighlight } from './ihighlight';

export interface ISearchResult {
  name: string;
  score: number;
  highlights: IHighlight[];
}