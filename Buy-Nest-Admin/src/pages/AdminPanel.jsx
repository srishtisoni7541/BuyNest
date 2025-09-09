
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AllCategories from "../components/AllCategory";
import AllProducts from "../components/AllProducts";
import ComingSoon from "../components/ComingSoon";
import CreateCategory from "../components/CreateCategoryForm";
import CreateProduct from "../components/CreateProductForm";
import Dashboard from "../components/Dashboard";
import Orders from "../components/Orders";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import ProfilePopup from "../components/Profile";
import EditProfilePopup from "../components/EditProfile";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const [editProfilePopupOpen, setEditProfilePopupOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login"); 
    }
  }, [navigate]);

  const handleProfileSave = (updatedData) => {
    console.log("Profile updated:", updatedData);
  };

  // Sample data
  const [categories] = useState([
    { id: 1, name: "Electronics", products: 45, status: "Active" },
    { id: 2, name: "Clothing", products: 23, status: "Active" },
    { id: 3, name: "Home & Garden", products: 12, status: "Inactive" },
  ]);

  const [products] = useState([
    {
      id: 1,
      name: "Premium Product",
      category: "Electronics",
      price: "$99.99",
      stock: 25,
      status: "Active",
    },
    {
      id: 2,
      name: "Fashion Item",
      category: "Clothing",
      price: "$49.99",
      stock: 15,
      status: "Active",
    },
    {
      id: 3,
      name: "Garden Tool",
      category: "Home & Garden",
      price: "$29.99",
      stock: 8,
      status: "Inactive",
    },
  ]);

  const [orders] = useState([
    {
      id: "#ORD-001",
      customer: "John Doe",
      total: "$129.98",
      status: "Processing",
      date: "2024-08-16",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      total: "$79.99",
      status: "Shipped",
      date: "2024-08-15",
    },
    {
      id: "#ORD-003",
      customer: "Mike Johnson",
      total: "$199.99",
      status: "Delivered",
      date: "2024-08-14",
    },
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "create-category":
        return <CreateCategory />;
      case "create-product":
        return <CreateProduct />;
      case "all-categories":
        return (
          <AllCategories categories={categories} setActiveTab={setActiveTab} />
        );
      case "all-products":
        return <AllProducts products={products} setActiveTab={setActiveTab} />;
      case "orders":
        return <Orders orders={orders} />;
      default:
        return <ComingSoon />;
    }
  };

  return (
    <div className="bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        setProfilePopupOpen={setProfilePopupOpen}
        setEditProfilePopupOpen={setEditProfilePopupOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <MobileHeader setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
      </div>

      {/* Profile Popup */}
      <ProfilePopup
        isOpen={profilePopupOpen}
        onClose={() => setProfilePopupOpen(false)}
      />
      <EditProfilePopup
        isOpen={editProfilePopupOpen}
        onClose={() => setEditProfilePopupOpen(false)}
        onSave={handleProfileSave}
      />
    </div>
  );
};

export default AdminPanel;
