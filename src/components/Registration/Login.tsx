import React, { useState } from "react";
import { fetchFn } from "../../utils/fetchFn";
import safeAsync from "../../utils/safeAsync";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hooks";
import { setUser } from "../../redux/authSlice";

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

    navigate(`/dashboard/${data.user.role}`);
  };

  return (
    <div className="bg-slate-50 w-full max-w-md mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Login to continue to Printerly</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-6 inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
