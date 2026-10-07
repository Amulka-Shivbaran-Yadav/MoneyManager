import { Download, LoaderCircle, Mail } from "lucide-react";
//import income from "../pages/Income.jsx";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment";
import { useState } from "react";

const IncomeList = ({ transactions, onDelete, onDownload, onEmail }) => {
  const [loading, setLoading] = useState(false);

  const handleEmail = async () => {
    setLoading(true);
    try {
      await onEmail();
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      await onDownload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>
        <div className="flex items-center justify-end gap-2">
          <button
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 hover:text-indigo-600 transition"
            onClick={handleEmail}
          >
            {/*<Mail size={15} className="text-base"/> Email*/}
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Emailing...
              </>
            ) : (
              <>
                <Mail size={15} className="text-base" /> Email
              </>
            )}
          </button>

          <button
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 hover:text-indigo-600 transition"
            onClick={handleDownload}
          >
            {/*<Download size={15} className="text-base"/> Download*/}
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download size={15} className="text-base" /> Download
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/*display the incomes*/}
        {transactions?.map((income) => (
          <TransactionInfoCard
            key={income.id}
            title={income.name}
            icon={income.icon}
            date={moment(income.date).format("Do MMM YYYY")}
            amount={income.amount}
            type="income"
            onDelete={() => onDelete(income.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
