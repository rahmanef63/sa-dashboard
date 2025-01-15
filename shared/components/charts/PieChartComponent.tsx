import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card } from "shared/components/ui/card";

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartComponentProps {
  data: PieChartData[];
  title?: string;
  height?: number;
}

const PieChartComponent = ({ data, title, height = 400 }: PieChartComponentProps) => {
  return (
    <Card className="p-6">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div style={{ height: height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={height / 3}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PieChartComponent;