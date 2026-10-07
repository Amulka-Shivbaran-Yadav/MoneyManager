import { useState } from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";

const FilterForm = () => {
  const [filter, setFilter] = useState({
    type: "income",
    startDate: "",
    endDate: "",
    keyword: "",
    sortField: "date",
    sortOrder: "desc",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilter = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axiosConfig.post(
        API_ENDPOINTS.FILTER_TRANSACTIONS,
        filter,
      );

      setResults(response.data);

      toast.success("Filter applied");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Filtering failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Filter Transactions</h2>

      <form
        onSubmit={handleFilter}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block mb-1 font-medium">Transaction Type</label>

          <select
            className="w-full border rounded-lg p-2"
            value={filter.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Keyword</label>

          <input
            type="text"
            className="w-full border rounded-lg p-2"
            placeholder="Search by name"
            value={filter.keyword}
            onChange={(e) => handleChange("keyword", e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Start Date</label>

          <input
            type="date"
            className="w-full border rounded-lg p-2"
            value={filter.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Date</label>

          <input
            type="date"
            className="w-full border rounded-lg p-2"
            value={filter.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Sort Field</label>

          <select
            className="w-full border rounded-lg p-2"
            value={filter.sortField}
            onChange={(e) => handleChange("sortField", e.target.value)}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Sort Order</label>

          <select
            className="w-full border rounded-lg p-2"
            value={filter.sortOrder}
            onChange={(e) => handleChange("sortOrder", e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700"
          >
            {loading ? "Filtering..." : "Apply Filter"}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">
          Results ({results.length})
        </h3>

        {results.length === 0 ? (
          <p className="text-gray-500">No transactions found.</p>
        ) : (
          <div className="space-y-3">
            {results.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.categoryName}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>

                <div
                  className={`font-bold ${
                    filter.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹ {item.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterForm;
