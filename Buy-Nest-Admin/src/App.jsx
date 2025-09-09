import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import AdminPanel from "./pages/AdminPanel";
import ForgotPassword from "./components/ForgotPasswordForm";
import ResetPassword from "./components/ResetPasswordForm";
import ProtectedRoute from "./uitls/ProtectedRoute";
import GoogleSuccess from "./components/GoogleSuccess";
import Orders from "./components/Orders";
import Customers from "./components/ComingSoon";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/google-success" element={<GoogleSuccess  />} />
          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin-panel/orders" element={<Orders />} />
          <Route path="/admin-panel/customers" element={<Customers />} />


          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
