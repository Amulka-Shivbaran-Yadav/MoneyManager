import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const CustomLineChart = ({ data }) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { amount } = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded shadow-lg border border-gray-200 text-sm">
          <p>
            <strong>Date:</strong> {label}
          </p>
          <p>
            <strong>Total:</strong> ${amount}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />

        <Line
          type="monotone"
          dataKey="amount"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={true}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="none"
          fill="url(#colorAmount)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
//
//
//
//
//
//
//
//
//
//
//
//
//
// // src/components/CustomLineChart.jsx
// // import {
// //     ResponsiveContainer,
// //     LineChart,
// //     Line,
// //     XAxis,
// //     YAxis,
// //     CartesianGrid,
// //     Tooltip,
// //     Area,
// //     AreaChart,
// // } from "recharts";
// //
// // const CustomLineChart = ({ data }) => {
// //     return (
// //         <ResponsiveContainer width="100%" height={300}>
// //             <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
// //                 <defs>
// //                     {/* Define gradient for shading */}
// //                     <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
// //                         <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
// //                         <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
// //                     </linearGradient>
// //                 </defs>
// //
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="date" />
// //                 <YAxis />
// //                 <Tooltip />
// //
// //                 {/* Line */}
// //                 <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2} dot={true} />
// //
// //                 {/* Shaded area under the line */}
// //                 <Area type="monotone" dataKey="amount" stroke={false} fill="url(#colorAmount)" />
// //             </AreaChart>
// //         </ResponsiveContainer>
// //     );
// // };
// //
// // export default CustomLineChart;
//
//
//
//
// // // src/components/CustomLineChart.jsx
// // import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// //
// // const CustomLineChart = ({ data }) => {
// //     return (
// //         <ResponsiveContainer width="100%" height={300}>
// //             <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="date" />
// //                 <YAxis />
// //                 <Tooltip />
// //                 <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2} />
// //             </LineChart>
// //         </ResponsiveContainer>
// //     );
// // };
// //
// // export default CustomLineChart;
