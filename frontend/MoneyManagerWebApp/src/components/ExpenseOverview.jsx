import { useEffect, useState } from "react";
import { prepareExpenseLineChartData } from "../util/chartUtils";
import CustomLineChart from "./CustomLineChart.jsx";
import { Plus } from "lucide-react";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const result = prepareExpenseLineChartData(transactions);

      console.log("Expense Chart Data:", result);

      setChartData(result);
    }
  }, [transactions]);

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">Expense Overview</h5>

          <p className="text-xs text-gray-400 mt-5">
            Track your spending over time and analyze your expense trends.
          </p>
        </div>

        <button
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          onClick={onAddExpense}
        >
          <Plus size={15} className="text-red-900" />

          <span className="font-bold">Add Expense</span>
        </button>
      </div>

      <div className="mt-10">
        {chartData.length > 0 ? (
          <CustomLineChart data={chartData} />
        ) : (
          <p className="text-gray-400 text-sm">No expense data available.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseOverview;
