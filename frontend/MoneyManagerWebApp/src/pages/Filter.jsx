import { useUser } from "../hooks/useUser.jsx";
import Dashboard from "../components/Dashboard.jsx";
import FilterForm from "../components/FilterForm.jsx";

const Filter = () => {
  useUser();

  return (
    <Dashboard activeMenu="Filters">
      <div className="my-5">
        <FilterForm />
      </div>
    </Dashboard>
  );
};

export default Filter;
