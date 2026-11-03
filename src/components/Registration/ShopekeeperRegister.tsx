import React, { useState, useEffect } from "react";
import { fetchFn } from "../../utils/fetchFn";
import { useGeolocation } from "../../utils/getGeoLocation";
import safeAsync from "../../utils/safeAsync";

type LocationType = {
  type: "Point";
  coordinates: [number, number] | [];
};

type PricingType = {
  blackAndWhite: number;
  colorPrint: number;
  lamination: number;
  binding: number;
};

type FormErrors = Record<string, string>;

const ShopkeeperRegister: React.FC = () => {
  const { latitude, longitude, error, locationLoading, getLocation } = useGeolocation();

  // Personal details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setPhone] = useState("");

  // Shop details
  const [shopName, setShopName] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [services, setServices] = useState("");
  const [address, setAddress] = useState("");
  const [locationUrl, setLocationUrl] = useState("");

  // Pricing
  const [pricing, setPricing] = useState<PricingType>({
    blackAndWhite: 0,
    colorPrint: 0,
    lamination: 0,
    binding: 0,
  });

  // Location
  const [location, setLocation] = useState<LocationType>({
    type: "Point",
    coordinates: [],
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Update coordinates when geolocation is available
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setLocation({
        type: "Point",
        coordinates: [longitude, latitude],
      });

      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.location;
        return updated;
      });
    }
  }, [latitude, longitude]);

  // Validate personal details
  const validateStepOne = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

  // Validate shop details
  const validateStepTwo = (): boolean => {
    const newErrors: FormErrors = {};

    if (!shopName.trim()) {
      newErrors.shopName = "Shop name is required";
    }

    if (!openingHours.trim()) {
      newErrors.openingHours = "Opening hours are required";
    }

    if (!address.trim()) {
      newErrors.address = "Shop address is required";
    }

    if (!services.trim()) {
      newErrors.services = "Please enter at least one service";
    }

    if (!locationUrl.trim()) {
      newErrors.locationUrl = "Shop location URL is required";
    } else {
      try {
        const url = new URL(locationUrl);
        if (!["http:", "https:"].includes(url.protocol)) {
          newErrors.locationUrl = "Enter a valid HTTP or HTTPS URL";
        }
      } catch {
        newErrors.locationUrl = "Enter a valid location URL";
      }
    }

    if (pricing.blackAndWhite <= 0) {
      newErrors.blackAndWhite = "Enter a price greater than 0";
    }

    if (pricing.colorPrint <= 0) {
      newErrors.colorPrint = "Enter a price greater than 0";
    }

    if (pricing.lamination <= 0) {
      newErrors.lamination = "Enter a price greater than 0";
    }

    if (pricing.binding <= 0) {
      newErrors.binding = "Enter a price greater than 0";
    }

    if (location.coordinates.length !== 2) {
      newErrors.location = "Shop coordinates could not be captured";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Continue to step 2
  const handleContinue = () => {
    if (!validateStepOne()) return;

    setStep(2);
    getLocation();
  };

  // Update pricing
  const handlePricingChange = (field: keyof PricingType, value: string) => {
    const numberValue = Number(value);

    setPricing((prev) => ({
      ...prev,
      [field]: numberValue >= 0 ? numberValue : 0,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // Submit registration
  const handleFormSubmit = async () => {
    if (!validateStepTwo()) return;

    setLoading(true);

    const registerBody = {
      name: name.trim(),
      email: email.trim(),
      password,
      mobile: mobile.trim(),
      shopName: shopName.trim(),
      openingHours: openingHours.trim(),
      services: services.trim(),
      pricing,
      address: address.trim(),
      location,
      locationUrl: locationUrl.trim(),
    };

    try {
      const [data, err] = await safeAsync(
        fetchFn("/register/shop", {
          method: "POST",
          body: registerBody,
        }),
      );

      if (err !== null) {
        console.error("Shop registration failed:", err);
        alert("Unable to register shop. Please try again.");
        return;
      }

      console.log("Shopkeeper registered successfully:", data);
      alert("Registration successful!");
    } finally {
      setLoading(false);
    }
  };

  // Reusable error message
  const FieldError = ({ field }: { field: string }) => {
    if (!errors[field]) return null;

    return <p className="mt-1.5 text-xs font-medium text-red-600">{errors[field]}</p>;
  };

  // Reusable input classes
  const inputClass = (field: string) =>
    `w-full rounded-xl border ${
      errors[field] ? "border-red-400" : "border-slate-200"
    } bg-white px-4 py-3 text-sm text-slate-900 outline-none transition
    placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10`;

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
                {/* NAME */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>

                  <input
                    className={inputClass("name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Enter your name"
                  />
                  <FieldError field="name" />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>

                  <input
                    className={inputClass("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                  />
                  <FieldError field="email" />
                </div>

                {/* MOBILE */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Mobile number</label>

                  <input
                    className={inputClass("mobile")}
                    value={mobile}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="Enter your mobile number"
                  />
                  <FieldError field="mobile" />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>

                  <input
                    className={inputClass("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Minimum 8 characters"
                  />
                  <FieldError field="password" />
                </div>

                <button
                  type="button"
                  disabled={locationLoading}
                  onClick={handleContinue}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {locationLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Fetching location...
                    </>
                  ) : (
                    "Continue"
                  )}
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
                {/* SHOP NAME */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Shop name</label>

                  <input
                    className={inputClass("shopName")}
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Enter your shop name"
                  />
                  <FieldError field="shopName" />
                </div>

                {/* OPENING HOURS */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Opening hours</label>

                  <input
                    className={inputClass("openingHours")}
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    placeholder="e.g., 9 AM - 8 PM"
                  />
                  <FieldError field="openingHours" />
                </div>

                {/* ADDRESS */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Shop address</label>

                  <input
                    className={inputClass("address")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your shop address"
                  />
                  <FieldError field="address" />
                </div>

                {/* SERVICES */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Services</label>

                  <input
                    className={inputClass("services")}
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    placeholder="e.g., Printing, Lamination, Binding"
                  />
                  <FieldError field="services" />
                </div>

                {/* LOCATION URL */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Google Maps location URL</label>

                  <input
                    className={inputClass("locationUrl")}
                    value={locationUrl}
                    onChange={(e) => setLocationUrl(e.target.value)}
                    type="url"
                    placeholder="https://maps.google.com/..."
                  />

                  <p className="mt-1 text-xs text-slate-500">Paste your shop's Google Maps sharing link.</p>

                  <FieldError field="locationUrl" />
                </div>

                {/* PRICING */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">Set item pricing</h3>

                    <p className="mt-1 text-xs text-slate-500">Enter the price for each service in ₹.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {(
                      [
                        ["blackAndWhite", "Black & White"],
                        ["colorPrint", "Color Print"],
                        ["lamination", "Lamination"],
                        ["binding", "Binding"],
                      ] as const
                    ).map(([field, label]) => (
                      <div key={field}>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">{label}</label>

                        <input
                          className={inputClass(field)}
                          type="number"
                          min="0"
                          step="0.01"
                          value={pricing[field] || ""}
                          onChange={(e) => handlePricingChange(field, e.target.value)}
                          placeholder="Enter price"
                        />

                        <FieldError field={field} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* LOCATION STATUS */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  {location.coordinates.length === 2 ? (
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">
                        ✓
                      </span>

                      <span className="text-sm font-medium text-emerald-700">Location captured successfully</span>
                    </div>
                  ) : locationLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                      <span className="text-sm text-slate-600">Fetching location...</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-amber-700">Location not available</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {error || "Please enable location access and try again."}
                      </p>

                      <button
                        type="button"
                        onClick={getLocation}
                        className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        Retry location
                      </button>
                    </div>
                  )}

                  <FieldError field="location" />
                </div>

                {/* ACTIONS */}
                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setErrors({});
                      setStep(1);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:w-1/2"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={loading || locationLoading}
                    onClick={handleFormSubmit}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-1/2"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Creating shop...
                      </>
                    ) : locationLoading ? (
                      "Fetching location..."
                    ) : (
                      "Create shop"
                    )}
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

export default ShopkeeperRegister;
