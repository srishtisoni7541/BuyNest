import {
  Edit3,
  LayoutDashboard,
  List,
  LogOut,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { deleteUserAccount, logoutUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Sidebar Component
const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  settingsOpen,
  setSettingsOpen,
  setProfilePopupOpen,
  setEditProfilePopupOpen,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "create-category", label: "Create Category", icon: Plus },
    { id: "create-product", label: "Create Product", icon: Package },
    { id: "all-categories", label: "All Categories", icon: List },
    { id: "all-products", label: "All Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
  ];

  const settingsItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "edit-profile", label: "Edit Profile", icon: Edit3 },
    { id: "logout", label: "Logout", icon: LogOut },
    { id: "delete-account", label: "Delete Account", icon: Trash2 },
  ];

  const handleSettingsAction = (action) => {
    switch (action) {
      case "profile":
        setProfilePopupOpen(true);
        setSettingsOpen(false);
        setSidebarOpen(false);
        break;
      case "edit-profile":
        setEditProfilePopupOpen(true);
        setSettingsOpen(false);
        setSidebarOpen(false);
        break;
      case "logout":
        dispatch(logoutUser()).then(() => {
          navigate("/login"); 
        });
        break;
      case "delete-account":
        dispatch(deleteUserAccount()).then(()=>{
            navigate('/signup');
        })
        if (
          confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
          )
        ) {
          alert("Account deletion would be implemented here");
        }
        setSettingsOpen(false);
        break;
      default:
        setActiveTab(action);
        setSettingsOpen(false);
    }
  };

  return (
    <div
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed lg:sticky lg:translate-x-0 top-0 left-0 z-50 h-screen w-80 bg-white shadow-xl border-r border-gray-200 transition-transform duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-600">Manage your store</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-2 px-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-gray-900 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <div className="relative">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>

          {/* Settings Dropdown */}
          {settingsOpen && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
              {settingsItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSettingsAction(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                    item.id === "delete-account"
                      ? "text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
