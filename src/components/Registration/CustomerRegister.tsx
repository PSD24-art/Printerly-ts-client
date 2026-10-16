import { useState } from "react";
import { fetchFn } from "../../utils/fetchFn";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hooks";
import { setUser } from "../../redux/authSlice";

const CustomerRegister: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mobile, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleFormSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    async function postCustomer() {
      setLoading(true);
      const registerBody = { name, email, password, mobile };

      try {
        const data = await fetchFn(`/register/customer`, {
          method: "POST",
          body: registerBody,
        });

        console.log("Customer created successfully: ", data);

        setName("");
        setEmail("");
        setPassword("");
        setPhone("");

        if (data.user) {
          dispatch(setUser(data.user));
        }

        navigate("/customer/dashboard");
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }

    postCustomer();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-slate-600">Creating your account...</p>
        </div>
      </div>
    );
  }

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
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="customer-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                Full name
              </label>

              <input
                id="customer-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter your name"
                required={true}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label htmlFor="customer-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                id="customer-email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Enter your email"
                required={true}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label htmlFor="customer-mobile" className="mb-1.5 block text-sm font-medium text-slate-700">
                Mobile number
              </label>

              <input
                id="customer-mobile"
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                value={mobile}
                placeholder="Enter your number"
                required={true}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label htmlFor="customer-password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                id="customer-password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Enter your password"
                required={true}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
            >
              Create account
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
