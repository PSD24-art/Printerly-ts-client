import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Clock3, Store, ArrowRight, Package, RefreshCw } from "lucide-react";

import { useAppSelector } from "../hooks/hooks";
import { useGeolocation } from "../utils/getGeoLocation";
import safeAsync from "../utils/safeAsync";
import { fetchFn } from "../utils/fetchFn";

interface Shop {
  _id: string;
  shopName: string;
  address: string;
  openingHours?: string;
}

interface ResponseObj {
  success: boolean;
  message: string;
  shops?: Shop[];
}

interface CustomerOrder {
  _id: string;
  otp?: number;
  status?: string;
  totalPrice?: number;
  createdAt?: string;
  shopName?: string;
  shop?: {
    shopName?: string;
    locationUrl?: string;
  };
}

interface CustomerOrdersResponse {
  success: boolean;
  message: string;
  orders?: CustomerOrder[];
}

const getStatusStyle = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-emerald-50 text-emerald-700";
    case "accepted":
    case "processing":
      return "bg-blue-50 text-blue-700";
    case "rejected":
    case "cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
};

const CustomerDashboard: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const { latitude, longitude, error, locationLoading, getLocation } = useGeolocation();

  const [shops, setShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [ordersExpanded, setOrdersExpanded] = useState(true);

  const [shopsLoading, setShopsLoading] = useState(false);
  const [shopsError, setShopsError] = useState("");

  // Get customer's location.
  useEffect(() => {
    getLocation();
  }, []);

  // Fetch nearby shops.
  useEffect(() => {
    if (latitude == null || longitude == null) return;

    let cancelled = false;

    async function getShopList() {
      setShopsLoading(true);
      setShopsError("");

      const [data, err] = await safeAsync(
        fetchFn<ResponseObj>(`/customer/shoplist?latitude=${latitude}&longitude=${longitude}`, { method: "GET" }),
      );

      if (cancelled) return;

      if (err || !data?.success) {
        setShopsError(data?.message || "Unable to load nearby shops.");
        setShopsLoading(false);
        return;
      }

      setShops(data.shops ?? []);
      setShopsLoading(false);
    }

    getShopList();

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude]);

  // Fetch all orders belonging to the logged-in customer.
  useEffect(() => {
    const customerId = user?.id;

    if (!customerId) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    let cancelled = false;

    async function getCustomerOrders() {
      setOrdersLoading(true);
      setOrdersError("");

      const [data, err] = await safeAsync(
        fetchFn<CustomerOrdersResponse>(`/customer/orders/${customerId}`, { method: "GET" }),
      );

      if (cancelled) return;

      if (err || !data?.success) {
        setOrdersError(data?.message || "Unable to load your orders.");
        setOrdersLoading(false);
        return;
      }
      console.log("Get orders", data);
      setOrders(data.orders ?? []);
      setOrdersLoading(false);
    }

    getCustomerOrders();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const filteredShops = shops.filter((shop) => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return true;

    return shop.shopName?.toLowerCase().includes(query) || shop.address?.toLowerCase().includes(query);
  });

  const refreshOrders = () => {
    // Re-run the existing order request without reloading the page.
    const customerId = user?.id;
    if (!customerId) return;

    async function reload() {
      setOrdersLoading(true);
      setOrdersError("");

      const [data, err] = await safeAsync(
        fetchFn<CustomerOrdersResponse>(`/customer/orders/${customerId}`, { method: "GET" }),
      );

      if (err || !data?.success) {
        setOrdersError(data?.message || "Unable to load your orders.");
      } else {
        setOrders(data.orders ?? []);
      }

      setOrdersLoading(false);
    }

    reload();
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
      <main className="mx-auto max-w-6xl">
        {/* Welcome header */}
        <header className="mb-5 sm:mb-7">
          <p className="text-xs font-medium text-indigo-600 sm:text-sm">Customer Dashboard</p>

          <h1 className="mt-1 break-words text-lg font-semibold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
            Welcome, {user?.email || "Customer"}
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
            Manage your print orders and find nearby print shops.
          </p>
        </header>

        {/* Shop search */}
        <section className="mb-5 rounded-xl border border-slate-200 bg-white p-3 sm:mb-7 sm:rounded-2xl sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search shops by name or address..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 sm:text-sm"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-slate-400 hover:bg-slate-200"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 self-start rounded-lg bg-indigo-50 px-3 py-2.5 sm:self-auto">
              <MapPin size={15} className="shrink-0 text-indigo-600" />
              <span className="text-xs font-medium text-indigo-700">Shops near you</span>
            </div>
          </div>
        </section>

        {/* Nearby shops heading */}
        <div className="mb-3 flex items-end justify-between gap-3 sm:mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Nearby Shops</h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {searchQuery
                ? `${filteredShops.length} ${filteredShops.length === 1 ? "shop" : "shops"} found`
                : `${shops.length} ${shops.length === 1 ? "shop" : "shops"} available`}
            </p>
          </div>

          <span className="hidden rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 sm:block">
            {shops.length} nearby
          </span>
        </div>

        {/* Location and shop loading/error states */}
        {locationLoading || shopsLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-10">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
            <p className="text-xs text-slate-500">
              {locationLoading ? "Getting your location..." : "Finding nearby shops..."}
            </p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">We couldn't get your location</p>
            <p className="mt-1 text-xs leading-5 text-amber-700">
              {error}. Enable location access and try again to find nearby shops.
            </p>
            <button
              type="button"
              onClick={getLocation}
              className="mt-3 rounded-lg bg-amber-700 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-800"
            >
              Try again
            </button>
          </div>
        ) : shopsError ? (
          <div className="rounded-xl border border-red-100 bg-white p-4">
            <p className="text-xs text-red-600">{shopsError}</p>
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center sm:py-14">
            <Search size={24} className="mx-auto text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-800">No shops found</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
              {searchQuery
                ? "Try another shop name or address."
                : "There are currently no nearby print shops available."}
            </p>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {filteredShops.map((shop) => (
              <li
                key={shop._id}
                className="group flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:rounded-2xl sm:p-5"
              >
                <div className="flex-1">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 sm:h-11 sm:w-11 sm:rounded-xl">
                        <Store size={18} />
                      </div>

                      <h3 className="break-words text-sm font-semibold text-slate-900 sm:text-base">{shop.shopName}</h3>
                    </div>

                    <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700 sm:text-xs">
                      Available
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium text-slate-400 sm:text-xs">Address</p>
                        <p className="mt-0.5 break-words text-xs leading-5 text-slate-600 sm:text-sm">{shop.address}</p>
                      </div>
                    </div>

                    {shop.openingHours && (
                      <div className="flex items-start gap-2.5">
                        <Clock3 size={15} className="mt-0.5 shrink-0 text-slate-400" />
                        <div>
                          <p className="text-[10px] font-medium text-slate-400 sm:text-xs">Opening hours</p>
                          <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">{shop.openingHours}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/customer/shop/${shop._id}`)}
                  className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 sm:mt-5 sm:rounded-xl sm:text-sm"
                >
                  Place your order
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Your Orders */}
        <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white sm:mb-8 sm:rounded-2xl mt-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-3 sm:px-5 sm:py-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Package size={18} />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-slate-900 sm:text-base">Your Orders</h2>
                <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">Track your print orders</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 sm:text-xs">
                {orders.length} total
              </span>

              <button
                type="button"
                onClick={refreshOrders}
                disabled={ordersLoading}
                aria-label="Refresh orders"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <RefreshCw size={14} className={ordersLoading ? "animate-spin" : ""} />
              </button>

              <button
                type="button"
                onClick={() => setOrdersExpanded((value) => !value)}
                className="rounded-md px-1.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
              >
                {ordersExpanded ? "Hide" : "View"}
              </button>
            </div>
          </div>

          {ordersExpanded && (
            <div className="p-3 sm:p-5">
              {ordersLoading ? (
                <div className="flex items-center justify-center gap-2 py-7">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
                  <p className="text-xs text-slate-500">Loading your orders...</p>
                </div>
              ) : ordersError ? (
                <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                  <p className="text-xs text-red-700">{ordersError}</p>
                  <button
                    type="button"
                    onClick={refreshOrders}
                    className="mt-2 text-xs font-semibold text-red-700 underline"
                  >
                    Try again
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-5 text-center">
                  <Package size={24} className="mx-auto text-slate-300" />
                  <p className="mt-2 text-sm font-medium text-slate-700">No orders yet</p>
                  <p className="mt-1 text-xs text-slate-500">Place your first print order from a nearby shop.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {orders.map((order) => {
                    const status = order.status || "Pending";

                    return (
                      <article
                        key={order._id}
                        className="min-w-0 rounded-lg border border-slate-200 p-3 transition hover:border-indigo-200 sm:p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
                              Order #{order._id.slice(-8)}
                            </p>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {order.shopName || order.shop?.shopName || "Print shop"}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-medium capitalize sm:text-xs ${getStatusStyle(status)}`}
                          >
                            {status}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                          <div>
                            <p className="text-[10px] text-slate-400 sm:text-xs">Order total</p>
                            <p className="mt-0.5 text-sm font-semibold text-slate-900">₹{order.totalPrice ?? 0}</p>
                          </div>
                          {order.otp && <p className="bg-red-500 p-1 rounded-md text-white">OTP: {order.otp}</p>}
                          {order.createdAt && (
                            <p className="text-[10px] text-slate-400 sm:text-xs">
                              {new Date(order.createdAt).toLocaleDateString("en-IN")}
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CustomerDashboard;
