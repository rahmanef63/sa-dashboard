export interface QueryItem {
  name: string;
  query: string;
  description: string;
}

export interface QueryCollection {
  [key: string]: QueryItem[];
}
