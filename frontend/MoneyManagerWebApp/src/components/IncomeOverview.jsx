// // src/components/IncomeOverview.jsx

import { useEffect, useState } from "react";
// Import your line chart component and data preparation function
import { prepareIncomeLineChartData } from "../util/chartUtils";
import CustomLineChart from "./CustomLineChart";
import { Plus } from "lucide-react"; // adjust path if needed

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const result = prepareIncomeLineChartData(transactions);
      console.log(result);
      setChartData(result);
    }
  }, [transactions]);

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">Income Overview</h5>
          <p className="text-xs text-gray-400 mt-5">
            Track your earnings over time and analyze your income trends.
          </p>
        </div>
        <button
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
          onClick={onAddIncome}
        >
          <Plus size={15} className="text-green-900" />
          <span className="font-bold">Add Income</span>
        </button>
      </div>

      <div className="mt-10">
        {chartData.length > 0 ? (
          <CustomLineChart data={chartData} />
        ) : (
          <p className="text-gray-400 text-sm">No income data available.</p>
        )}
      </div>
    </div>
  );
};

export default IncomeOverview;
