
import { useEffect, useState } from "react";
import Button from "./Button";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, logout } from "../features/auth/authSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-slate-900">BuyNest</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-700 hover:text-slate-900">
              Home
            </Link>
            <Link className="text-slate-700 hover:text-slate-900">Products</Link>
            <Link className="text-slate-700 hover:text-slate-900">About</Link>
            <Link className="text-slate-700 hover:text-slate-900">Contact</Link>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <ShoppingCart className="w-6 h-6 text-slate-700 hover:text-slate-900 cursor-pointer transition-colors" />
            
            {user ? (
             <Link to="/admin-panel">
              <div className="flex items-center space-x-2">
                <User className="w-6 h-6 text-slate-700" />
                <span className="font-medium text-slate-800">{user.name}</span>
                
              </div>
             </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
                <Link to="/login">
                  <Button>Sign In</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
