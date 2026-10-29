import "./App.css";
import { Route, Routes } from "react-router-dom";
import CustomerRegister from "./components/Registration/CustomerRegister";
import ShopekeeperRegister from "./components/Registration/ShopekeeperRegister";
import Login from "./components/Registration/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashBoard from "./pages/AdminDashBoard";
import ShopkeeperDashboard from "./pages/ShopkeeperDashboard";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks/hooks";
import { getCurrentUser } from "./redux/authSlice";
import IndividualShop from "./pages/IndividualShop";
import Navbar from "./components/Utility/Navbar";
import Footer from "./components/Utility/Footer";
import Home from "./pages/Home";
function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#f6f8fb] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <main className="pt-20 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          <Route path="/register/customer" element={<CustomerRegister />} />

          <Route path="/register/shopkeeper" element={<ShopekeeperRegister />} />

          <Route path="/login" element={<Login />} />

          <Route path="/dashboard/customer" element={<CustomerDashboard />} />

          <Route path="/dashboard/admin" element={<AdminDashBoard />} />

          <Route path="/dashboard/shopkeeper" element={<ShopkeeperDashboard />} />

          <Route path="/customer/shop/:shopId" element={<IndividualShop />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
