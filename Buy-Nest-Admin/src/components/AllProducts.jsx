import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  updateProduct,
} from "../features/products/ProductSlice";
import StatusBadge from "./StatusBadge";
import TableContainer from "./TableContainer";
import { fetchCategories } from "../features/categories/CategorySlice";
import EditForm from "./EditCategoryForm";
import TableActions from "./Table";

const AllProducts = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    list: products,
    loading,
    error,
  } = useSelector((state) => state.products);
  // console.log(products);
  const { list: categories } = useSelector((state) => state.categories);
  

  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products and categories on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);
   const filteredProducts = products.filter((p) => {
    if (!searchTerm) return true;
    const regex = new RegExp(searchTerm, "i");
    return regex.test(p.title);
  });
  return (
    <TableContainer
      title="All Products"
      onAdd={() => setActiveTab("create-product")}
      addButtonText="Add Product"
      onSearchChange={setSearchTerm}
      searchValue={searchTerm}
      searchPlaceholder="Search products..."
    >
      {/* Edit Modal */}
      {editingProduct && editingProduct._id && (
        <EditForm
          initialData={editingProduct}
          fields={[
            { name: "title", type: "text", placeholder: "Product Name" },
            { name: "price", type: "number", placeholder: "Price" },
            { name: "stock", type: "number", placeholder: "Stock Quantity" },
            {
              name: "description",
              type: "textarea",
              placeholder: "Description",
            },
            {
              name: "category",
              type: "select",
              options: categories.map((c) => c.name),
            },
            {
              name: "status",
              type: "select",
              options: ["Available", "Out of Stock"],
            },
            { name: "images", type: "file", multiple: true },
          ]}
          onClose={() => setEditingProduct(null)}
          onSubmit={(data) => {
            if (!editingProduct || !editingProduct._id) {
              return Promise.reject({ message: "No product selected" });
            }
            const id = editingProduct._id;
            return dispatch(updateProduct({ id, data })).unwrap();
          }}
        />
      )}

      {loading ? (
        <p className="p-4 text-gray-500">Loading products...</p>
      ) : error ? (
        <p className="p-4 text-red-500">{error.message}</p>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Stock
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
            {filteredProducts.map((product) => (
              <tr key={product._id || product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900 font-medium">
                  {product.title}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {product.category
                    ? product.category.name || product.category
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-900 font-semibold">
                  {product.price}
                </td>
                <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={product.status ||"Active"} />
                </td>
                <td className="px-6 py-4">
                  <TableActions
                    item={product}
                    type="product"
                    onEdit={(prod) => {
                      console.log(prod);
                      if (prod && prod._id) setEditingProduct(prod);
                    }}
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

export default AllProducts;
