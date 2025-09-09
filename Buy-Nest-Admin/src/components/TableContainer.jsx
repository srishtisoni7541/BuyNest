import { Plus, Search } from "lucide-react";

const TableContainer = ({
  title,
  onAdd,
  addButtonText,
  children,
  onSearchChange,
  searchValue,
  searchPlaceholder = "Search..."
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {onAdd && (
          <button
            onClick={onAdd}
            className="bg-gray-900 text-white px-4 py-2 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{addButtonText}</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      {onSearchChange && (
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchValue || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder={searchPlaceholder}
          />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">{children}</div>
      </div>
    </div>
  );
};

export default TableContainer;
