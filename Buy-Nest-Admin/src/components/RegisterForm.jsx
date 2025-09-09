import React, { useState } from "react";
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
import api from "../API/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // Validate form
  const validate = () => {
    let tempErrors = {};

    if (!formData.name.trim()) tempErrors.name = "Name is required";
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
        const response = await api.post("/admin/register", formData);

        // Backend response ke hisaab se check kar
        if (response.status === 200 && response.data?.message) {
          toast.success(
            response.data?.message || "Account created successfully! 🎉"
          );

          // reset form
          setFormData({ name: "", email: "", password: "" });

          // sirf success hone par hi redirect
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else {
          toast.error(response.data?.message || "Something went wrong!");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.response?.data?.message || "Registration failed!");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const benefits = [
    { icon: Truck, text: "Free Shipping" },
    { icon: Shield, text: "Secure Shopping" },
    { icon: Headphones, text: "24/7 Support" },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className=" w-full px-20 grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Side - Welcome Content */}
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

          {/* Trust indicators */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.9★</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">99%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full px-30 mx-auto lg:mx-0">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">Join our amazing community</p>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block text-center mb-8">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">Start your journey with us</p>
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User
                      className={`h-5 w-5 transition-colors duration-200 ${
                        formData.name ? "text-gray-900" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200 ${
                      errors.name
                        ? "border-red-300 bg-red-50 focus:ring-red-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-600 text-sm flex items-center mt-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.name}
                  </p>
                )}
              </div>

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
                  <p className="text-red-600 text-sm flex items-center mt-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.email}
                  </p>
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
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm flex items-center mt-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className={`w-full py-4 px-4 rounded-xl font-semibold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl relative overflow-hidden group ${
                  isSubmitting ? "animate-pulse" : ""
                }`}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2 relative z-10">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 relative z-10">
                    <User className="w-5 h-5" />
                    <span>Create Account</span>
                  </div>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-gray-900 hover:text-gray-700 font-semibold transition-colors duration-200 underline underline-offset-2"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
