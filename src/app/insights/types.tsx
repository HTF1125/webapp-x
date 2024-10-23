// app/insights/types.ts

export interface InsightHeader {
  _id: string;
  date: string;
  title: string;
}



export interface Insight {
  _id: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
}
