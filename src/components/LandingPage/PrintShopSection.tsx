import Badge from "../Utility/Badge";
import ShopDesktopPreview from "./ShopDesktopPreview";

const PrintShopSection = () => (
  <section id="forPrintShops" className="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="teal" className="mb-6">
          For Print Shops
        </Badge>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-6">
          Turn your print shop into a digital storefront.
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Receive orders digitally, view customer documents instantly, manage print settings, and keep your queue
          perfectly organized.
        </p>
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Behind-dashboard decorations to give depth */}
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 to-teal-50 opacity-50 blur-lg rounded-3xl -z-10 hidden md:block"></div>
        <ShopDesktopPreview />
      </div>

      <div className="mt-16 grid sm:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
        <div>
          <h4 className="text-3xl font-bold text-slate-900 mb-2">0</h4>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">USB Drives Handled</p>
        </div>
        <div>
          <h4 className="text-3xl font-bold text-slate-900 mb-2">100%</h4>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Digital Queue</p>
        </div>
        <div>
          <h4 className="text-3xl font-bold text-slate-900 mb-2">Instant</h4>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Payment Processing</p>
        </div>
      </div>
    </div>
  </section>
);

export default PrintShopSection;
