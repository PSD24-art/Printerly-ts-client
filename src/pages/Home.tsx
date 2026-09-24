import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <p>Welcome to homepage</p>

      <div>
        <button onClick={() => navigate("/register/customer")}>
          Register customer
        </button>
        <br />
        <button onClick={() => navigate("/register/shopkeeper")}>
          Register Shopkeeper
        </button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
};

export default Home;
