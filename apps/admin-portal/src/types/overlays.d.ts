/// <reference types="vite/client" />

declare module 'react-router-dom' {
  export const BrowserRouter: React.ComponentType<any>;
  export const Routes: React.ComponentType<any>;
  export const Route: React.ComponentType<any>;
  export const Link: React.ComponentType<any>;
  export const Navigate: React.ComponentType<any>;
  export const Outlet: React.ComponentType<any>;
  export function useLocation(): any;
  export function useNavigate(): any;
}

declare module 'recharts' {
  export const LineChart: React.ComponentType<any>;
  export const Line: React.ComponentType<any>;
  export const XAxis: React.ComponentType<any>;
  export const YAxis: React.ComponentType<any>;
  export const CartesianGrid: React.ComponentType<any>;
  export const Tooltip: React.ComponentType<any>;
  export const ReferenceLine: React.ComponentType<any>;
  export const ResponsiveContainer: React.ComponentType<any>;
  export const BarChart: React.ComponentType<any>;
  export const Bar: React.ComponentType<any>;
  export const PieChart: React.ComponentType<any>;
  export const Pie: React.ComponentType<any>;
  export const Cell: React.ComponentType<any>;
  export const AreaChart: React.ComponentType<any>;
  export const Area: React.ComponentType<any>;
}