import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatusBadge from "./StatusBadge";
import TableContainer from "./TableContainer";
import {
  fetchCategories,
  updateCategory,
} from "../features/categories/CategorySlice";
import TableActions from "./Table";
import EditForm from "./EditCategoryForm";

const AllCategories = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const {
    list: categories,
    loading,
    error,
  } = useSelector((state) => state.categories);

  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = categories.filter((p) => {
    if (!searchTerm) return true;
    const regex = new RegExp(searchTerm, "i");
    return regex.test(p.name);
  });
  return (
    <TableContainer
      title="All Categories"
      onAdd={() => setActiveTab("create-category")}
      addButtonText="Add Category"
      onSearchChange={setSearchTerm}
      searchValue={searchTerm}
      searchPlaceholder="Search products..."
    >
      {/* Edit Modal */}
      {editingCategory && (
        <EditForm
          initialData={editingCategory}
          fields={[
            { name: "name", type: "text", placeholder: "Category Name" },
            {
              name: "description",
              type: "textarea",
              placeholder: "Description",
            },
            { name: "status", type: "select", options: ["Active", "Inactive"] },
          ]}
          onClose={() => setEditingCategory(null)}
          onSubmit={(data) =>
            dispatch(updateCategory({ id: editingCategory._id, data })).unwrap()
          }
        />
      )}

      {loading ? (
        <p className="p-4 text-gray-500">Loading categories...</p>
      ) : error ? (
        <p className="p-4 text-red-500">{error}</p>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Products
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900 font-medium">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {category.products || 0}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={category.status || "Active"} />
                </td>
                <td className="px-6 py-4">
                  <TableActions
                    type="category"
                    item={category}
                    onEdit={(cat) => setEditingCategory(cat)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </TableContainer>
  );
};

export default AllCategories;
