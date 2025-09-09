import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPassword } from "../features/auth/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot Password Request for:", email);
    if (!email) return toast.error("Please enter your email");
    dispatch(forgotPassword(email));
  };

  //  Toast Notifications based on redux state
  useEffect(() => {
    if (success) {
      toast.success(success);
      setEmail("");
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Your Password?
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Enter your registered email address and we’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none transition disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-3 rounded-xl shadow-md transition duration-200 ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black hover:bg-gray-800 text-white"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>

      {/* Toaster Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default ForgotPassword;
