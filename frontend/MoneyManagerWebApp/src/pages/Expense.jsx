import { useUser } from "../hooks/useUser.jsx";
import Dashboard from "../components/Dashboard.jsx";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";

import ExpenseList from "../components/ExpenseList.jsx";
import Modal from "../components/Modal.jsx";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import ExpenseOverview from "../components/ExpenseOverview.jsx";

const Expense = () => {
  useUser();

  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);

      if (response.status === 200) {
        setExpenseData(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseCategories = async () => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.CATEGORY_BY_TYPE("expense"),
      );

      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleAddExpense = async (expense) => {
    const { name, amount, date, icon, categoryId } = expense;

    if (!name.trim()) return toast.error("Enter expense name");

    if (!amount || Number(amount) <= 0)
      return toast.error("Enter valid amount");

    if (!date) return toast.error("Select date");

    if (!categoryId) return toast.error("Select category");

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId,
      });

      if (response.status === 201) {
        toast.success("Expense Added");

        setOpenAddExpenseModal(false);

        fetchExpenseDetails();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));

      toast.success("Expense Deleted");

      setOpenDeleteAlert({
        show: false,
        data: null,
      });

      fetchExpenseDetails();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;
      link.download = "expense.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      toast.success("Downloaded");
    } catch (error) {
      toast.error("Download failed");
    }
  };

  const handleEmailExpenseDetails = async () => {
    try {
      await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);

      toast.success("Email Sent");
    } catch (error) {
      toast.error("Email failed");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    fetchExpenseCategories();
  }, []);

  return (
    <Dashboard activeMenu="Expense">
      <div className="my-5">
        <ExpenseOverview
          transactions={expenseData}
          onAddExpense={() => setOpenAddExpenseModal(true)}
        />

        <div className="mt-5">
          <ExpenseList
            transactions={expenseData}
            onDelete={(id) =>
              setOpenDeleteAlert({
                show: true,
                data: id,
              })
            }
            onDownload={handleDownloadExpenseDetails}
            onEmail={handleEmailExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm
            onAddExpense={handleAddExpense}
            categories={categories}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() =>
            setOpenDeleteAlert({
              show: false,
              data: null,
            })
          }
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default Expense;
