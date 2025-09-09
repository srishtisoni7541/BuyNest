import { Save } from "lucide-react";
import FormContainer from "./FormContainer";
import FormField from "./FormField";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createCategory } from "../features/categories/CategorySlice";
import toast from "react-hot-toast";

const CreateCategory = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required ");
      return;
    }

    try {
      const result = await dispatch(createCategory(formData)).unwrap();
      toast.success(result.message || "Category created successfully! ✅");

      setFormData({ name: "", description: "", status: "Active" });
    } catch (err) {
      console.error("CreateCategory error:", err);
      toast.error(err?.message || "Something went wrong ❌");
    }
  };

  return (
    <FormContainer title="Create New Category">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Category Name"
          name="name"
          placeholder="Enter category name"
          value={formData.name}
          onChange={handleChange}
        />
        <FormField
          label="Description"
          name="description"
          type="textarea"
          rows={4}
          placeholder="Enter category description"
          value={formData.description}
          onChange={handleChange}
        />
        <FormField
          label="Status"
          name="status"
          type="select"
          options={["Active", "Inactive"]}
          value={formData.status}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>{loading ? "Creating..." : "Create Category"}</span>
        </button>
      </form>
    </FormContainer>
  );
};

export default CreateCategory;
