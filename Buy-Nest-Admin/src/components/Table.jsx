import { useState } from "react";
import { Edit3, Eye, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { deleteCategory } from "../features/categories/CategorySlice";
import { deleteProduct } from "../features/products/ProductSlice";

const TableActions = ({ item, type, onEdit, showDelete = true }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      if (type === "category") {
        await dispatch(deleteCategory(item._id)).unwrap();
        toast.success("Category deleted successfully!");
      } else if (type === "product") {
        await dispatch(deleteProduct(item._id)).unwrap();
        toast.success("Product deleted successfully!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <button className="text-gray-600 hover:text-gray-900" onClick={() => onEdit?.(item)}>
          <Eye className="w-4 h-4" />
        </button>
        <button className="text-gray-600 hover:text-gray-900" onClick={() => onEdit?.(item)}>
          <Edit3 className="w-4 h-4" />
        </button>
        {showDelete && (
          <button className="text-red-600 hover:text-red-900" onClick={() => setShowModal(true)}>
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg flex flex-col space-y-4">
            <h2 className="text-lg font-semibold">Are you sure?</h2>
            <p>Do you really want to delete this item? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableActions;
