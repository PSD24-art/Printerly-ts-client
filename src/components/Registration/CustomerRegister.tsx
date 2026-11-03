import React, { useState } from "react";
import { fetchFn } from "../../utils/fetchFn";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hooks";
import { setUser } from "../../redux/authSlice";
import { useDialog } from "../../Context/DialogueContext";

type FormErrors = {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
};

const CustomerRegister: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { alert } = useDialog();

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must contain at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^(?:\+91[-\s]?)?[6-9]\d{9}$/.test(mobile.trim())) {
      newErrors.mobile = "Enter a valid 10-digit Indian mobile number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    if (!validateForm()) return;

    setLoading(true);

    const registerBody = {
      name: name.trim(),
      email: email.trim(),
      password,
      mobile: mobile.trim(),
    };

    try {
      const data = await fetchFn("/register/customer", {
        method: "POST",
        body: registerBody,
      });

      console.log("Customer created successfully:", data);

      if (data.user) {
        dispatch(setUser(data.user));
      }

      navigate("/dashboard/customer");
    } catch (e) {
      console.error("Customer registration failed:", e);

      alert({
        title: "Registration failed",
        message: e instanceof Error ? e.message : "Unable to create your account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full rounded-xl border ${
      errors[field] ? "border-red-400" : "border-slate-200"
    } bg-white px-4 py-3 text-sm text-slate-900 outline-none transition
    placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10`;

  const FieldError = ({ field }: { field: keyof FormErrors }) => {
    if (!errors[field]) return null;

    return <p className="mt-1.5 text-xs font-medium text-red-600">{errors[field]}</p>;
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Create your Printerly account
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Register as a customer and start printing without the queue.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5" noValidate>
            {/* NAME */}
            <div>
              <label htmlFor="customer-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                Full name
              </label>

              <input
                id="customer-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: "" }));
                }}
                type="text"
                placeholder="Enter your name"
                className={inputClass("name")}
                disabled={loading}
              />

              <FieldError field="name" />
            </div>

            {/* EMAIL */}
            <div>
              <label htmlFor="customer-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                id="customer-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                type="email"
                placeholder="Enter your email"
                className={inputClass("email")}
                disabled={loading}
              />

              <FieldError field="email" />
            </div>

            {/* MOBILE */}
            <div>
              <label htmlFor="customer-mobile" className="mb-1.5 block text-sm font-medium text-slate-700">
                Mobile number
              </label>

              <input
                id="customer-mobile"
                value={mobile}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, mobile: "" }));
                }}
                type="tel"
                placeholder="Enter your number"
                className={inputClass("mobile")}
                disabled={loading}
              />

              <FieldError field="mobile" />
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="customer-password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                id="customer-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                type="password"
                placeholder="Minimum 8 characters"
                className={inputClass("password")}
                disabled={loading}
              />

              <FieldError field="password" />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Your account lets you find nearby print shops and place orders.
        </p>
      </div>
    </div>
  );
};

export default CustomerRegister;
