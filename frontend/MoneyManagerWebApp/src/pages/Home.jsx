import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import Dashboard from "./../components/Dashboard";

const Home = () => {
  useUser();

  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    axiosConfig
      .get("/dashboard")
      .then((res) => {
        setDashboardData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Dashboard activeMenu="Dashboard">
      {dashboardData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="text-gray-500">Total Balance</h3>
              <p className="text-2xl font-bold text-green-600">
                ₹ {dashboardData.totalBalance}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="text-gray-500">Total Income</h3>
              <p className="text-2xl font-bold text-blue-600">
                ₹ {dashboardData.totalIncome}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="text-gray-500">Total Expense</h3>
              <p className="text-2xl font-bold text-red-600">
                ₹ {dashboardData.totalExpense}
              </p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

            {dashboardData.recentTransaction.length === 0 ? (
              <p>No transactions found.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboardData.recentTransaction.map((item) => (
                    <tr key={`${item.type}-${item.id}`} className="border-b">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 capitalize">{item.type}</td>
                      <td className="py-2">₹ {item.amount}</td>
                      <td className="py-2">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </Dashboard>
  );
};

export default Home;
