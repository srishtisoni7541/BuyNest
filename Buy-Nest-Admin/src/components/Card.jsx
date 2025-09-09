
import { useNavigate } from "react-router-dom";

const StatsCard = ({ title, value, icon: Icon, bgColor, iconColor, to, setActiveTab }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (setActiveTab) {
      setActiveTab(to); 
    } else if (to) {
      navigate(to); 
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
