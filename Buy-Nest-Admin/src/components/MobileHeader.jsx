import { Menu } from "lucide-react";

// Mobile Header Component
const MobileHeader = ({ setSidebarOpen }) => (
  <div className="lg:hidden bg-white border-b border-gray-200 p-4">
    <div className="flex items-center justify-between">
      <button
        onClick={() => setSidebarOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="font-semibold text-gray-900">Admin Panel</h1>
      <div className="w-9"></div>
    </div>
  </div>
);


export default MobileHeader;