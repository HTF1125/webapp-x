// app/strategies/types.tsx

export interface Book {
  d: string[];
  v: number[];
  l: number[];
  b: number[];
  s: { [ticker: string]: number[] }[];
  c: { [ticker: string]: number[] }[];
  w: { [ticker: string]: number[] }[];
  a: { [ticker: string]: number[] }[];
}

export interface Strategy {
  _id: string;
  code: string;
  last_updated: string;
  ann_return: number;
  ann_volatility: number;
  nav_history: number[];
  book: Book;
}
