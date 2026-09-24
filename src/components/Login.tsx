import React, { useState } from "react";
import { fetchFn } from "../utils/FetchFn";
import safeAsync from "../utils/safeAsync";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { setUser } from "../redux/authSlice";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleLogin = async () => {
    const requestBody = { email, password };
    const [data, err] = await safeAsync(
      fetchFn("/auth/login", {
        method: "POST",
        body: requestBody,
      }),
    );

    if (err) {
      alert(`Oops: ${err.message}`);
      return;
    }

    if (data.user) {
      dispatch(setUser(data.user));
    }

    navigate(`/${data.user.role}/dashboard`);
  };

  return (
    <div>
      <p>Login to Printerly</p>

      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name=""
          id=""
          placeholder="Enter your email"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          name=""
          id=""
          placeholder="Enter your password"
        />
      </div>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
