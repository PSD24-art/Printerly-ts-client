import { Printer } from "lucide-react";

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Printerly</span>
          </div>
          <p className="text-sm">Connecting customers with local print shops for a seamless digital experience.</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Customer</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Find a Shop
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Orders
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                How It Works
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Print Shops</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Register Your Shop
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Shop Login
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                How It Works
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <p>© 2026 Printerly. All rights reserved.</p>
        <div className="flex gap-4">
          {/* Social placeholders */}
          <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer transition-colors"></div>
          <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer transition-colors"></div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
