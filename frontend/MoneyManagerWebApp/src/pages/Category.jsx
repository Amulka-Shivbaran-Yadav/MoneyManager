import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import { Plus } from "lucide-react";
import CategoryList from "../components/CategoryList.jsx";
import {useEffect, useState} from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import Modal from "../components/Modal.jsx";
import AddCategoryForm from "../components/AddCategoryForm.jsx";

const Category =() =>{
    useUser();
    const [loading,setLoading]=useState(false);
    const [categoryData,setCategoryData]=useState([]);
    const [openAddCategoryModal,setOpenAddCategoryModal]=useState(false);
    const [openEditCategoryModal,setOpenEditCategoryModal]=useState(false);
    const [selectedCategory,setSelectedCategory]=useState(null);

    const fetchCategoryDetails=async () =>{
        if(loading) return;

        setLoading(true);

        try{
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);

            if (response.status === 200) {
                console.log("categories response:", response.data);

                // if backend returns array directly
                if (Array.isArray(response.data)) {
                    setCategoryData(response.data);
                }
                // if backend wraps inside "categories"
                else if (response.data.categories) {
                    setCategoryData(response.data.categories);
                }
                else {
                    setCategoryData([]);
                }
            }
        // const response=await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
        //     if (response.status === 200) {
        //         console.log('categories', response.data);
        //         setCategoryData(response.data.categories || []); // <- Important
        //     }
        // if(response.status===200){
        //     console.log('categories',response.data);
        //     setCategoryData(response.data);
        // }

        }catch (error) {
            console.log('something went wrong.Please try again.',error);
            toast.error(error.message);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    const handleAddCategory =async (category) =>{
    //    console.log('Category added successfully',category);
        const {name,type,icon}=category;

        if(!name.trim()){
            toast.error("Category Name is required");
            return;
        }

        //check if the category already exits
        const isDuplicate=categoryData.some((category) => {
            return category.name.toLowerCase()===name.trim().toLowerCase();
        })

        if(isDuplicate){
            toast.error("Category Name already exits");
            return;
        }




        try {
           const response =await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY,{name,type,icon});
           if(response.status===201){
               toast.success("Category added successfully");
               setOpenAddCategoryModal(false);
               fetchCategoryDetails();
           }
        }catch (error){
            console.error('Error adding category:',error);
            toast.error(error.response?.data?.message || "Failed to add category");
        }
    }

    const handleEditCategory=(categoryToEdit)=>{
        setSelectedCategory(categoryToEdit);
        setOpenEditCategoryModal(true);
    }

    const handleUpdateCategory =async (updatedCategory) =>{
        const {id,name,type,icon}=updatedCategory;
        if (!name.trim()){
            toast.error("Category Name ir required");
            return;
        }
        if(!id){
            toast.error("Category ID is missing for update");
        }

        try {
           await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id),{name,type,icon});
           setOpenEditCategoryModal(false);
           setSelectedCategory(null);
           toast.success("Category updated successfully");
           fetchCategoryDetails();
        }catch (error){
            console.error('Error updating category:',error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to update category.");
        }

    }


    return(
        <Dashboard activeMenu="Category">
            <div className="my-5 mx-auto">
                {/*Add button to add category*/}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-semibold">All Categories</h2>
                    {/*<button className="add-btn flex items-center gap-1">*/}
                    <button onClick={()=>setOpenAddCategoryModal(true)}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                        <Plus size={15} className="text-green-900" />
                        <span className="font-bold">Add Category</span>
                    </button>
                </div>

                {/* Category list */}
                <CategoryList categories={categoryData} onEditCategory={handleEditCategory}/>

                {/*Adding category modal*/}
                <Modal
                    isOpen={openAddCategoryModal}
                    onClose={()=>setOpenAddCategoryModal(false)}
                    title="Add Category"
                >
                    <AddCategoryForm onAddCategory={handleAddCategory}/>
                </Modal>

                {/*Updating category model*/}
                <Modal
                    isOpen={openEditCategoryModal}
                    onClose={() =>{
                        setOpenEditCategoryModal(false);
                        setSelectedCategory(null);
                }}
                    title="Update Category"
                >
                    <AddCategoryForm
                        initialCategoryData={selectedCategory}
                        onAddCategory={handleUpdateCategory}
                        isEditing={true}
                    />
                </Modal>
            </div>
        </Dashboard>
    )
}

export default Category