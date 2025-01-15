import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card } from "shared/components/ui/card";

export interface LineChartData {
  name: string;
  [key: string]: string | number; // This makes the interface more flexible to accept any string key with number/string value
}

interface LineChartComponentProps {
  data: LineChartData[];
  title?: string;
  height?: number;
  lines: {
    key: string;
    color: string;
    name: string;
  }[];
}

const LineChartComponent = ({ data, title, height = 400, lines }: LineChartComponentProps) => {
  return (
    <Card className="p-6">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div style={{ height: height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                name={line.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default LineChartComponent;