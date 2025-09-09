import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  User,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  ArrowLeft,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { fetchAllOrders, updateOrderStatus } from "../features/orders/OrderSlice";
import { Link } from "react-router-dom";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // console.log(orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Filter orders based on search and status
  const filteredOrders =
    orders?.filter((order) => {
      const matchesSearch =
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-6">
        <p className="text-red-700 font-medium">Error loading orders</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
             <div className="flex items-center gap-3 ">
          <Link to="/admin-panel">
            <ArrowLeft />
          </Link>
          <h1 className="text-4xl font-bold mb-2  bg-clip-text text-black">
            Order Management
          </h1>
        </div>
            <p className="text-gray-600">
              Manage and track all customer orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-64">
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {orders?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {orders?.filter((o) => o.orderStatus === "pending")?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {orders?.filter((o) => o.orderStatus === "processing")?.length ||
                0}
            </div>
            <div className="text-sm text-gray-500">Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {orders?.filter((o) => o.orderStatus === "shipped")?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Shipped</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {orders?.filter((o) => o.orderStatus === "delivered")?.length ||
                0}
            </div>
            <div className="text-sm text-gray-500">Delivered</div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {currentOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No orders have been placed yet"}
            </p>
          </div>
        ) : (
          currentOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        #{order.orderNumber}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {order.shippingAddress?.fullName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ₹{order.totalAmount?.toLocaleString()}
                      </div>
                      <StatusBadge status={order.orderStatus} />
                    </div>

                    <button
                      onClick={() => toggleOrderExpansion(order._id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {expandedOrders[order._id] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.shippingAddress?.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.userId?.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.products?.length || 0} Items
                      </div>
                      <div className="text-sm text-gray-500">Order Total</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.shippingAddress?.city}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.shippingAddress?.postalCode}
                      </div>
                    </div>
                  </div>
                  <div>{}</div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrders[order._id] && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Customer Details */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Customer Details
                        </h4>
                        <div className="bg-white rounded-lg p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">
                              {order.shippingAddress?.fullName}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {order.userId?.email}
                            </span>
                          </div>
                          {order.userId?.phone && (
                            <div className="flex items-center gap-3">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {order.userId.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Shipping Address
                        </h4>
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                            <div className="text-gray-600">
                              <div className="font-medium text-gray-900 mb-1">
                                {order.shippingAddress?.fullName}
                              </div>
                              <div>{order.shippingAddress?.addressLine}</div>
                              <div>
                                {order.shippingAddress?.city},{" "}
                                {order.shippingAddress?.state}
                              </div>
                              <div>{order.shippingAddress?.postalCode}</div>
                              <div>{order.shippingAddress?.country}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      {order.products && order.products.length > 0 && (
                        <div className="lg:col-span-2">
                          <h4 className="font-semibold text-gray-900 mb-4">
                            Order Items
                          </h4>
                          <div className="bg-white rounded-lg overflow-hidden">
                            <div className="space-y-3 p-4">
                              {order.products.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg"
                                >
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">
                                      {item.title || "Product Name"}
                                    </h5>
                                    <p className="text-sm text-gray-500">
                                      {item.brand} • Size: {item.size} • Color:{" "}
                                      {item.color}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-sm text-gray-600">
                                        Qty: {item.quantity}
                                      </span>
                                      <span className="font-semibold text-gray-900">
                                        ₹
                                        {(
                                          item.price * item.quantity
                                        )?.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                      <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          dispatch(
                            updateOrderStatus({
                              orderId: order._id,
                              status: newStatus,
                            })
                          );
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <Download className="w-4 h-4" />
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 mt-6">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstOrder + 1} to{" "}
            {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-2 text-sm border rounded-lg ${
                  currentPage === index + 1
                    ? "bg-black text-white border-black"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
