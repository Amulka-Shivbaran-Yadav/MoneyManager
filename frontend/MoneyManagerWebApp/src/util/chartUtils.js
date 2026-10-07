// src/utils/chartUtils.js

// src/utils/chartUtils.js

/**
 * Prepare data for line chart from transactions
 * transactions: array of income objects {date: 'YYYY-MM-DD', amount: number}
 * returns: array formatted for chart [{date, amount}]
 */
export const prepareIncomeLineChartData = (transactions) => {
  if (!transactions || transactions.length === 0) return [];

  // Group by date
  const grouped = {};
  transactions.forEach((tx) => {
    if (!grouped[tx.date]) grouped[tx.date] = 0;
    grouped[tx.date] += tx.amount;
  });

  // Convert to chart data
  return Object.entries(grouped)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const prepareExpenseLineChartData = (transactions) => {
  if (!transactions || transactions.length === 0) return [];

  const grouped = {};

  transactions.forEach((tx) => {
    const date = tx.date;
    grouped[date] = (grouped[date] || 0) + Number(tx.amount);
  });

  return Object.entries(grouped)
    .map(([date, amount]) => ({
      date,
      amount,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

// // src/utils/chartUtils.js
//
// // Prepare data for line chart from transactions
// // transactions: array of income objects {date: 'YYYY-MM-DD', amount: number}
// // returns: array formatted for chart
// export const prepareIncomeLineChartData = (transactions) => {
//     if (!transactions || transactions.length === 0) return [];
//
//     // Sort transactions by date
//     const sortedTransactions = [...transactions].sort(
//         (a, b) => new Date(a.date) - new Date(b.date)
//     );
//
//     // Format data for chart (labels = dates, values = amounts)
//     return sortedTransactions.map(tx => ({
//         date: tx.date,
//         amount: tx.amount
//     }));
// };
