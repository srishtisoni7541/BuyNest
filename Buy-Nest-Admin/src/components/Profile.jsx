import { X, Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCurrentUser } from "../features/auth/authSlice";
const ProfilePopup = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  //   console.log(user);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCurrentUser());
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  // Agar loading ho rha h
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <p className="text-white text-lg">Loading profile...</p>
      </div>
    );
  }

  // Agar error aaya ho
  if (error) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!user) return null;
  const name = user?.admin?.name || user?.name || "";
  const email = user?.admin?.email || user?.email || "";
  const role = user?.admin?.role || user?.role || "";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Popup Container */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1632204416436-d0561c9c9380?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FkYnVyeXxlbnwwfHwwfHx8MA%3D%3D"}
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
              <p className="text-blue-100">{role}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Status Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {user.status || "Active"}
              </span>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {user.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">
                    {user.location || "Not Provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {user.admin.createdAt || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePopup;
