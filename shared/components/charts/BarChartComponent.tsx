import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card } from "shared/components/ui/card";

export interface BarChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface BarChartComponentProps {
  data: BarChartData[];
  title?: string;
  height?: number;
  bars: {
    key: string;
    color: string;
    name: string;
  }[];
}

const BarChartComponent = ({ data, title, height = 400, bars }: BarChartComponentProps) => {
  return (
    <Card className="p-6">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div style={{ height: height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {bars.map((bar) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                fill={bar.color}
                name={bar.name}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default BarChartComponent;