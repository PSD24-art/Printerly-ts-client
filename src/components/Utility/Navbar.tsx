import { Menu, Printer, X } from "lucide-react";
import Button from "./Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchFn } from "../../utils/fetchFn";
import { logout } from "../../redux/authSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    const isConfirmed = confirm("Do you really want to logout");

    if (!isConfirmed) {
      return;
    }

    try {
      await fetchFn("/auth/logout", {
        method: "POST",
      });

      dispatch(logout());
      navigate("/home");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };
  let user = useAppSelector((state) => state.auth.user);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div
              onClick={() => navigate("/home")}
              className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors"
            >
              <Printer className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Printerly</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              How it Works
            </a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              For Customers
            </a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              For Print Shops
            </a>
          </div>

          {/* Desktop CTAs */}

          {user === null ? (
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("register/customer")} variant="primary">
                Find a Print Shop
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Button onClick={handleLogout} variant="logout">
                Logout
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <a
              href="#"
              className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
            >
              How it Works
            </a>
            <a
              href="#"
              className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
            >
              For Customers
            </a>
            <a
              href="#"
              className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
            >
              For Print Shops
            </a>

            {user === null ? (
              <div className="pt-4 flex flex-col gap-3">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("register/customer")} variant="primary">
                  Find a Print Shop
                </Button>
              </div>
            ) : (
              <div className="pt-4 flex flex-col gap-3">
                <Button onClick={handleLogout} variant="logout">
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
