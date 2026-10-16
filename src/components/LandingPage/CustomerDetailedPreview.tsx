import { CreditCard, MapPin, Settings2 } from "lucide-react";
import CustomerMobilePreview from "./CustomerMobilePreview";
import Badge from "../Utility/Badge";

const CustomerDetailedPreview = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text & Features */}
        <div>
          <Badge variant="blue" className="mb-6">
            For Customers
          </Badge>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-6">
            Everything you need before you reach the shop.
          </h2>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Our mobile-first experience is designed for convenience. Skip the counter interactions and get straight to
            printing.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Live Availability</h4>
                <p className="text-sm text-slate-600">
                  See which shops are open right now and what services they offer.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Granular Print Settings</h4>
                <p className="text-sm text-slate-600">
                  Control paper size, color modes, and binding options from a simple interface.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Upfront Pricing</h4>
                <p className="text-sm text-slate-600">
                  Know exactly what you'll pay before placing the order. No surprises.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: The UI */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Decorative background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-50 rounded-full -z-10"></div>

          <CustomerMobilePreview className="shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]" />
        </div>
      </div>
    </div>
  </section>
);

export default CustomerDetailedPreview;
