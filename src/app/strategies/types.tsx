export interface StrategySummary {
    code: string;
    last_updated: string | null;
    ann_return: number | null;
    ann_volatility: number | null;
    nav_history: number[] | null;
  }

  export interface Book {
    d: string[];
    v: number[];
    l: number[];
    s: { [ticker: string]: number[] }[];
    c: { [ticker: string]: number[] }[];
    w: { [ticker: string]: number[] }[];
    a: { [ticker: string]: number[] }[];
  }

  export interface Strategy extends StrategySummary {
    book: Book;
  }