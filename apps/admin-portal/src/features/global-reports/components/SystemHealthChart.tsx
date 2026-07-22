import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { LatencyDataPoint } from '../../../types/health';

interface SystemHealthChartProps {
  data?: LatencyDataPoint[];
  loading: boolean;
}

export function SystemHealthChart({ data, loading }: SystemHealthChartProps) {
  const chartData = data || [];
  
  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-3 text-sm text-zinc-500">Loading system health...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="System Health">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: '#71717A' }}
              tickLine={false}
              axisLine={{ stroke: '#E4E4E7' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#71717A' }}
              tickLine={false}
              axisLine={{ stroke: '#E4E4E7' }}
              tickFormatter={(v: number) => `${v}ms`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E4E4E7',
                borderRadius: '8px',
                fontSize: '13px',
              }}
              formatter={(value: number) => [`${value}ms`, 'Latency']}
            />
            <ReferenceLine y={500} stroke="#EF4444" strokeDasharray="5 5" label={{ value: '500ms', position: 'right', fill: '#EF4444', fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="latency"
              stroke="#4F46E5"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#4F46E5' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-indigo-600" />
          <span>API Latency</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 border-t border-dashed border-red-400" />
          <span className="text-red-500">500ms threshold</span>
        </div>
      </div>
    </Card>
  );
}