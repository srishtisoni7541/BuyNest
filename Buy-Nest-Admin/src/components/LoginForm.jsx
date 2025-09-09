import { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Check,
  Truck,
  Shield,
  Headphones,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc"; // Google icon
import api from "../API/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // Validate form
  const validate = () => {
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle submit with API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await api.post("/admin/login", formData);

        // Success criteria: status === 200 && accessToken exist
        if (response.status === 200 && response.data?.accessToken) {
          // Save token in localStorage
          localStorage.setItem("accessToken", response.data.accessToken);

          // ✅ Success toast with green check
          toast.success(
            response.data?.message || "Admin Logged In successfully! 🎉",
            {
              icon: "✅",
            }
          );

          setFormData({ email: "", password: "" });

          //  Redirect only when login is successful
          setTimeout(() => {
            navigate("/admin-panel");
          }, 1500);
        } else {
          //  Error toast (red)
          toast.error(response.data?.message || "Something went wrong!", {
            icon: "",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.response?.data?.message || "Login failed!", {
          icon: "❌",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/admin/google`;
  };

  const benefits = [
    { icon: Truck, text: "Free Shipping" },
    { icon: Shield, text: "Secure Shopping" },
    { icon: Headphones, text: "24/7 Support" },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className=" w-full px-20 grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Side */}
        <div className="hidden lg:block space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join Our Amazing Community
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Create your account to access exclusive deals, track your orders,
              and enjoy a personalized shopping experience.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {benefit.text}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Available for all members
                  </p>
                </div>
                <Check className="w-5 h-5 text-green-500 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full px-30 mx-auto lg:mx-0">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="hidden lg:block text-center mb-8">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login</h2>
              <p className="text-gray-600">Start your journey with us</p>
            </div>

            <div className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      className={`h-5 w-5 transition-colors duration-200 ${
                        formData.email ? "text-gray-900" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200 ${
                      errors.email
                        ? "border-red-300 bg-red-50 focus:ring-red-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      className={`h-5 w-5 transition-colors duration-200 ${
                        formData.password ? "text-gray-900" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200 ${
                      errors.password
                        ? "border-red-300 bg-red-50 focus:ring-red-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className={`w-full py-4 px-4 rounded-xl font-semibold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 shadow-lg ${
                  isSubmitting ? "animate-pulse" : ""
                }`}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 shadow-sm transition-all duration-200"
              >
                <FcGoogle className="w-6 h-6" />
                <span className="text-gray-700 font-medium">
                  Continue with Google
                </span>
              </button>
              <div className="text-right mt-2">
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
