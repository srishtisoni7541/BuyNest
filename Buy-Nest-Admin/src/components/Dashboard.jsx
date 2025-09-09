import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BarChart3, Package, ShoppingCart, Users } from "lucide-react";
import StatsCard from "./Card";
import RecentActivity from "./RecentActivity";
import { fetchProducts } from "../features/products/ProductSlice";
import { fetchAllOrders } from "../features/orders/OrderSlice";
import { fetchAllCustomers } from "../features/customers/customerSlice";


const Dashboard = ({ setActiveTab }) => {  
  const dispatch = useDispatch();

  const { list: products, loading } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.orders);
  const { customers } = useSelector((state) => state.customers);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchAllOrders());
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const productCount = loading ? "Loading..." : products?.length || 0;
  const orderCount = orders?.length || 0;
  const customerCount = customers?.length || 0;

  const statsData = [
    { title: "Total Products", value: productCount, icon: Package, bgColor: "bg-blue-100", iconColor: "text-blue-600", to: "all-products" },
    { title: "Total Orders", value: orderCount, icon: ShoppingCart, bgColor: "bg-green-100", iconColor: "text-green-600", to: "orders" },
    { title: "Total Customers", value: customerCount, icon: Users, bgColor: "bg-purple-100", iconColor: "text-purple-600", to: "customers" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} setActiveTab={setActiveTab} />
        ))}
      </div>

      <RecentActivity />
    </div>
  );
};

export default Dashboard;
