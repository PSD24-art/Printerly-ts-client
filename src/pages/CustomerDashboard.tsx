import { useAppSelector } from "../hooks/hooks";

const CustomerDashboard: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  return <div>Welcome {user?.email} to Customer Dashboard</div>;
};

export default CustomerDashboard;
