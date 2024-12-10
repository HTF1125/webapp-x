// app/strategies/types.tsx

export interface Book {
  d: string[]; //dates
  v: number[]; //nav values
  l: number[]; //liquidity values
  b: number[]; //benchmark values
  s: { [ticker: string]: number[] }[]; //holding shares
  c: { [ticker: string]: number[] }[]; //holding capitals
  w: { [ticker: string]: number[] }[]; //holding weight
  a: { [ticker: string]: number[] }[]; //allocation weight
}



export interface StrategiesKeyInfo {
  code: string;
  last_updated: string;
  ann_return: number;
  ann_volatility: number;
  nav_history: number[];
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
