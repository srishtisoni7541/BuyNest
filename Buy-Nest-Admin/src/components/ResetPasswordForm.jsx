import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../features/auth/authSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const { token } = useParams();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  //  Password validation function (same as before)
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const validCount = Object.values(requirements).filter(Boolean).length;
    let strength = '';
    let strengthColor = '';

    if (validCount === 0) {
      strength = '';
    } else if (validCount <= 2) {
      strength = 'Weak';
      strengthColor = 'bg-red-500';
    } else if (validCount <= 3) {
      strength = 'Fair';
      strengthColor = 'bg-yellow-500';
    } else if (validCount <= 4) {
      strength = 'Good';
      strengthColor = 'bg-blue-500';
    } else {
      strength = 'Strong';
      strengthColor = 'bg-green-500';
    }

    return {
      requirements,
      strength,
      strengthColor,
      isValid: validCount === 5,
    };
  };

  const passwordValidation = validatePassword(formData.newPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (!passwordValidation.isValid) {
      newErrors.newPassword = 'Password must meet all requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(
      resetPassword({
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      })
    );
  };

  useEffect(() => {
    if (success) {
      toast.success(success); 
      setFormData({ newPassword: '', confirmPassword: '' });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
    if (error) {
      toast.error(error); 
    }
  }, [success, error, navigate]);

  const isFormValid =
    passwordValidation.isValid &&
    formData.confirmPassword &&
    formData.newPassword === formData.confirmPassword;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-black via-gray-600 to-black"></div>

          <div className="p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                Create a new secure password for your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl text-gray-900 placeholder-gray-500 transition-all duration-300 outline-none text-sm sm:text-base ${
                    errors.newPassword
                      ? 'border-red-500 bg-red-50'
                      : formData.newPassword && passwordValidation.isValid
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 focus:border-black focus:bg-gray-50'
                  }`}
                />

                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    ⚠ {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl text-gray-900 placeholder-gray-500 transition-all duration-300 outline-none text-sm sm:text-base ${
                    errors.confirmPassword
                      ? 'border-red-500 bg-red-50'
                      : formData.confirmPassword &&
                        formData.newPassword === formData.confirmPassword
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 focus:border-black focus:bg-gray-50'
                  }`}
                />

                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    ⚠ {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 transform ${
                  isFormValid && !loading
                    ? 'bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <div className="text-center mt-4 sm:mt-6">
              <button
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-black text-xs sm:text-sm transition-colors duration-200"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
