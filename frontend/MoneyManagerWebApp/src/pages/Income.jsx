import { useUser } from "../hooks/useUser.jsx";
import Dashboard from "../components/Dashboard.jsx";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList.jsx";
import Modal from "../components/Modal.jsx";
import AddIncomeForm from "../components/AddIncomeForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import IncomeOverview from "../components/IncomeOverview.jsx";

const Income = () => {
  useUser();

  const [incomeData, setIncomeData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Debug
  console.log("Income State:", incomeData);

  // ================= FETCH INCOME ===================
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);

      console.log("Income API Response:", response.data);

      if (response.status === 200) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch income:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch income details",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH CATEGORY ===================
  const fetchIncomeCategories = async () => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.CATEGORY_BY_TYPE("income"),
      );

      console.log("Category Response:", response.data);

      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch categories",
      );
    }
  };

  // ================= ADD INCOME ===================
  const handleAddIncome = async (income) => {
    const { name, amount, date, icon, categoryId } = income;

    if (!name.trim()) return toast.error("Enter income name");
    if (!amount || Number(amount) <= 0)
      return toast.error("Enter valid amount");
    if (!date) return toast.error("Select date");
    if (!categoryId) return toast.error("Select category");

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId,
      });

      console.log("Added Income:", response.data);

      if (response.status === 201) {
        toast.success("Income Added");

        setOpenAddIncomeModal(false);

        // Refresh list immediately
        await fetchIncomeDetails();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add income");
    }
  };

  // ================= DELETE ===================
  const deleteIncome = async (id) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));

      toast.success("Income Deleted");

      setOpenDeleteAlert({
        show: false,
        data: null,
      });

      fetchIncomeDetails();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // ================= DOWNLOAD ===================
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;
      link.download = "income.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Downloaded");
    } catch (error) {
      toast.error("Download failed");
    }
  };

  // ================= EMAIL ===================
  const handleEmailIncomeDetails = async () => {
    try {
      await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME);

      toast.success("Email Sent");
    } catch (error) {
      toast.error("Email failed");
    }
  };

  // ================= PAGE LOAD ===================
  useEffect(() => {
    fetchIncomeDetails();
    fetchIncomeCategories();
  }, []);

  return (
    <Dashboard activeMenu="Income">
      <div className="my-5">
        <IncomeOverview
          transactions={incomeData}
          onAddIncome={() => setOpenAddIncomeModal(true)}
        />

        <div className="mt-5">
          <IncomeList
            transactions={incomeData}
            onDelete={(id) =>
              setOpenDeleteAlert({
                show: true,
                data: id,
              })
            }
            onDownload={handleDownloadIncomeDetails}
            onEmail={handleEmailIncomeDetails}
          />
        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm
            onAddIncome={handleAddIncome}
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
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default Income;
