export interface IHighlight {
  path: string;
  texts: {
    value: string;
    type: string;
  }[];
  score: number;
}