import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CustomerRegister from "./components/Registration/CustomerRegister";
import ShopekeeperRegister from "./components/Registration/ShopekeeperRegister";
import Login from "./components/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashBoard from "./pages/AdminDashBoard";
import ShopkeeperDashboard from "./pages/ShopkeeperDashboard";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks/hooks";
import { getCurrentUser } from "./redux/authSlice";
function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path={`/register/customer`} element={<CustomerRegister />} />
      <Route path={`/register/shopkeeper`} element={<ShopekeeperRegister />} />
      <Route path={`/login`} element={<Login />} />

      <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashBoard />} />
      <Route path="/shopkeeper/dashboard" element={<ShopkeeperDashboard />} />
    </Routes>
  );
}

export default App;
