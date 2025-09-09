import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCustomerAccount,
  fetchAllCustomers,
} from "../features/customers/customerSlice";
import { toast } from "react-hot-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Customers = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const handleDeleteCustomer = async (id) => {
    try {
      const res = await dispatch(deleteCustomerAccount(id)).unwrap();
      toast.success(res.message || "User deleted successfully ✅");

      // Refresh list
      dispatch(fetchAllCustomers());
      // Close popup
      setSelectedUser(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete user ❌");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-white rounded-full animate-pulse delay-75"></div>
          <div className="w-4 h-4 bg-white rounded-full animate-pulse delay-150"></div>
          <span className="text-black ml-3">Loading users...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-400 text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );

  const filteredCustomers = customers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-black p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-right duration-300 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <p className="text-white font-medium">{toast.message}</p>
        </div>
      )}
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 ">
          <Link to="/admin-panel">
            <ArrowLeft />
          </Link>
          <h1 className="text-4xl font-bold mb-2  bg-clip-text text-black">
            Customer Management
          </h1>
        </div>
        <div className="h-1 w-20 bg-white rounded-full"></div>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-600 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300"
          />
        </div>
        <p className="text-gray-400 text-sm mt-2">
          {filteredCustomers.length} customer
          {filteredCustomers.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Table Section */}
      <div className="bg-black rounded-2xl  border border-gray-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className=" border-b text-black border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="bg-gray-100 text-black  group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-400 rounded-full flex items-center justify-center text-black font-bold text-sm mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-black">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-medium bg-black text-white rounded-full capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-4 py-2 bg-black text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white">
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <div className="text-4xl mb-4">👥</div>
                      <p className="text-lg mb-2">No customers found</p>
                      <p className="text-sm">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md transform animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Customer Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-400 rounded-full flex items-center justify-center text-black font-bold text-xl mr-4">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{selectedUser.name}</h4>
                  <p className="text-gray-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Role:</span>
                  <span className="capitalize font-medium">
                    {selectedUser.role}
                  </span>
                </div>

                {selectedUser.address && (
                  <div className="py-2 border-b border-gray-800">
                    <span className="text-gray-400 block mb-2">Address:</span>
                    <p className="text-sm leading-relaxed">
                      {selectedUser.address.street}
                      <br />
                      {selectedUser.address.city}, {selectedUser.address.state}{" "}
                      - {selectedUser.address.zip}
                      <br />
                      {selectedUser.address.country}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700 flex gap-3 justify-end">
              <button className="px-6 py-2 border border-green-500 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-200 font-medium">
                Edit
              </button>
              <button
                onClick={() => handleDeleteCustomer(selectedUser._id)}
                className="px-6 py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
