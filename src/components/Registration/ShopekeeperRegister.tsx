import React, { useState, useEffect } from "react";
import { fetchFn } from "../../utils/fetchFn";
import { useGeolocation } from "../../utils/getGeoLocation";
import safeAsync from "../../utils/safeAsync";

type LocationType = {
  type: "Point";
  coordinates: [number, number] | []; // GeoJSON standard: [longitude, latitude]
};

type PricingType = {
  blackAndWhite: number;
  colorPrint: number;
  lamination: number;
  binding: number;
};

const ShopekeeperRegister: React.FC = () => {
  const { latitude, longitude, error, locationLoading, getLocation } = useGeolocation();

  // Step 1: Shopkeeper Personal Details
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mobile, setPhone] = useState<string>("");

  // Step 2: Shop Details
  const [shopName, setShopName] = useState<string>("");
  const [openingHours, setOpeningHours] = useState<string>("");
  const [services, setServices] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  // Pricing State
  const [pricing, setPricing] = useState<PricingType>({
    blackAndWhite: 0,
    colorPrint: 0,
    lamination: 0,
    binding: 0,
  });

  // Location State
  const [location, setLocation] = useState<LocationType>({
    type: "Point",
    coordinates: [],
  });

  // Multi-step control
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Automatically update coordinates when useGeolocation finishes fetching
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setLocation({
        type: "Point",
        coordinates: [longitude, latitude],
      });
    }
  }, [latitude, longitude]);

  // Handler to update nested pricing state safely
  const handlePricingChange = (field: keyof PricingType, value: string) => {
    setPricing((prev) => ({
      ...prev,
      [field]: Number(value) || 0, // Fallback to 0 if input parsing fails
    }));
  };

  const handleFormSubmit = async () => {
    if (error || location.coordinates.length === 0) {
      console.log("Location tracking failed:", error);
      alert("Unable to get your location. Please ensure location access is enabled before submitting.");
      return;
    }

    setLoading(true);

    const registerBody = {
      name,
      email,
      password,
      mobile,
      shopName,
      openingHours,
      services,
      pricing,
      address,
      location,
    };
    console.log("Request recieved here");

    const [data, err] = await safeAsync(
      fetchFn(`/register/shop`, {
        method: "POST",
        body: registerBody,
      }),
    );

    console.log("[data, err]", [data, err]);

    if (err !== null) {
      alert("Unable to register shop");
      console.log("Shop registration failed", err);
      setLoading(false);
      return;
    }

    console.log("Shopkeeper registered successfully: ", data);
    alert("Registration Successful!");
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Register your print shop</h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Set up your shop on Printerly and start receiving print orders.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* STEP INDICATOR */}
          <div className="mb-8 flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                step >= 1 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              1
            </div>

            <div className={`h-px flex-1 ${step >= 2 ? "bg-indigo-600" : "bg-slate-200"}`} />

            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                step >= 2 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              2
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Step 1 of 2</p>

                <h2 className="mt-1 text-xl font-semibold text-slate-900">Your details</h2>

                <p className="mt-1 text-sm text-slate-500">Tell us a little about yourself.</p>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>

                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>

                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Mobile number</label>

                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    onChange={(e) => setPhone(e.target.value)}
                    value={mobile}
                    type="text"
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>

                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  className="mt-2 w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                  onClick={() => {
                    setStep(2);
                    getLocation();
                  }}
                >
                  {locationLoading ? "Loading Location.." : loading ? "Loading.." : "Continue"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Step 2 of 2</p>

                <h2 className="mt-1 text-xl font-semibold text-slate-900">Shop details</h2>

                <p className="mt-1 text-sm text-slate-500">Add your shop information and printing prices.</p>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Shop name</label>

                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    type="text"
                    placeholder="Enter your shop name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Opening hours</label>

                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    type="text"
                    placeholder="e.g., 9 AM - 8 PM"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Address</label>

                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    placeholder="Enter your shop address"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Services</label>

                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    type="text"
                    placeholder="e.g., Printing, Lamination, Binding"
                  />
                </div>

                {/* PRICING */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">Set item pricing</h3>
                    <p className="mt-1 text-xs text-slate-500">Enter the price for each service in ₹.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">Black & White</label>

                      <input
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        type="number"
                        value={pricing.blackAndWhite || ""}
                        onChange={(e) => handlePricingChange("blackAndWhite", e.target.value)}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">Color Print</label>

                      <input
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        type="number"
                        value={pricing.colorPrint || ""}
                        onChange={(e) => handlePricingChange("colorPrint", e.target.value)}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">Lamination</label>

                      <input
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        type="number"
                        value={pricing.lamination || ""}
                        onChange={(e) => handlePricingChange("lamination", e.target.value)}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">Binding</label>

                      <input
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        type="number"
                        value={pricing.binding || ""}
                        onChange={(e) => handlePricingChange("binding", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* LOCATION STATUS */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  {location.coordinates.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">
                        ✓
                      </span>

                      <span className="text-sm font-medium text-emerald-700">Location captured successfully</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-sm text-amber-700">
                        ⏳
                      </span>

                      <span className="text-sm font-medium text-amber-700">Fetching location data...</span>
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99] sm:w-1/2"
                    onClick={() => setStep(1)}
                  >
                    Previous
                  </button>

                  <button
                    className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 sm:w-1/2"
                    onClick={handleFormSubmit}
                  >
                    Create shop
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopekeeperRegister;
