import { Package } from "lucide-react";

// Recent Activity Component
const RecentActivity = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
    <div className="space-y-4">
      {[1,2,3].map((item) => (
        <div key={item} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">New order received</p>
            <p className="text-sm text-gray-600">Order #ORD-00{item} - $99.99</p>
          </div>
          <span className="text-sm text-gray-500">2 min ago</span>
        </div>
      ))}
    </div>
  </div>
);

export default  RecentActivity;