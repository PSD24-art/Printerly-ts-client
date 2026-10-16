import { Loader } from "lucide-react";
import { useAppSelector } from "../hooks/hooks";
import AdminDashBoard from "../pages/AdminDashBoard";
import CustomerDashboard from "../pages/CustomerDashboard";
import Home from "../pages/Home";
import ShopkeeperDashboard from "../pages/ShopkeeperDashboard";

export const GetDashboard = () => {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Home />;
  }

  if (user.role === "customer") {
    return <CustomerDashboard />;
  }

  if (user.role === "shopkeeper") {
    return <ShopkeeperDashboard />;
  }

  if (user.role === "admin") {
    return <AdminDashBoard />;
  }

  return <Home />;
};
