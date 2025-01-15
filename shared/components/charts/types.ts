export interface LineChartData {
  name: string;
  [key: string]: string | number;
}

export interface BarChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}