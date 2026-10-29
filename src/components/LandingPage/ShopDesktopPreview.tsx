import { Badge, CheckCircle2, Clock, CreditCard, FileText, IndianRupee, Layers, Monitor, Store } from "lucide-react";
import Button from "../Utility/Button";

const ShopDesktopPreview = () => (
  <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
    {/* Mac-like Header */}
    <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-4">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-slate-300"></div>
        <div className="w-3 h-3 rounded-full bg-slate-300"></div>
        <div className="w-3 h-3 rounded-full bg-slate-300"></div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="bg-white border border-slate-200 rounded-md px-12 py-1 text-[11px] text-slate-400 font-medium flex items-center gap-2 shadow-sm">
          <Store className="w-3 h-3" /> shop.printerly.app
        </div>
      </div>
      <div className="w-12"></div> {/* Spacer for balance */}
    </div>

    <div className="flex-1 flex h-[500px] md:h-[600px] bg-slate-50">
      {/* Sidebar - Queue */}
      <div className="w-64 md:w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-3 text-sm">Order Queue</h3>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button className="flex-1 bg-white text-slate-900 shadow-sm rounded-md py-1.5 text-xs font-semibold">
              Active (4)
            </button>
            <button className="flex-1 text-slate-500 rounded-md py-1.5 text-xs font-medium hover:text-slate-900">
              Completed
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {/* Active Order Item */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 shadow-sm cursor-pointer relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
            <div className="flex justify-between items-start mb-1.5 ml-1">
              <span className="text-sm font-bold text-slate-900">#1024</span>
              <Badge fontVariant="amber" className="scale-90 origin-top-right">
                Needs Review
              </Badge>
            </div>
            <p className="text-sm font-semibold text-slate-800 ml-1">Jane Doe</p>
            <p className="text-xs text-slate-500 mt-1 ml-1 flex items-center gap-1">
              <FileText className="w-3 h-3" /> 1 File • $4.50
            </p>
          </div>

          {/* Other Items */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 hover:border-slate-300 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-1.5">
              <span className="text-sm font-bold text-slate-900">#1023</span>
              <Badge fontVariant="blue" className="scale-90 origin-top-right">
                Printing
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-700">Alex Smith</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <FileText className="w-3 h-3" /> 3 Files • $12.00
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 opacity-75">
            <div className="flex justify-between items-start mb-1.5">
              <span className="text-sm font-bold text-slate-900">#1022</span>
              <Badge fontVariant="teal" className="scale-90 origin-top-right">
                Ready for Pickup
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-700">Tech Corp</p>
            <p className="text-xs text-slate-500 mt-1">2 Files • $45.00</p>
          </div>
        </div>
      </div>

      {/* Main Content - Order Details */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Detail Header */}
        <div className="px-8 py-6 border-b border-slate-200 bg-white sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-slate-900">Order #1024</h2>
              <Badge fontVariant="amber">Needs Review</Badge>
            </div>
            <p className="text-slate-500 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Placed today at 10:42 AM
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200">
              Decline
            </Button>
            <Button variant="primary" className="gap-2">
              <CheckCircle2 className="w-4 h-4" /> Accept & Print
            </Button>
          </div>
        </div>

        {/* Detail Content */}
        <div className="p-8 space-y-8 max-w-3xl">
          {/* Customer Card */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Customer Details</h3>
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg border border-indigo-100">
                JD
              </div>
              <div>
                <p className="font-semibold text-slate-900">Jane Doe</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-slate-500">jane.doe@example.com</p>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" /> Paid via Card
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Document Section */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Documents to Print (1)
            </h3>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-50 text-red-500 rounded-lg border border-red-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">marketing-presentation.pdf</p>
                    <p className="text-xs text-slate-500 mt-0.5">24 pages • A4 Size</p>
                  </div>
                </div>
                <Button variant="outline" className="text-xs py-1.5 px-3 h-auto gap-1.5">
                  <Monitor className="w-3.5 h-3.5" /> View PDF
                </Button>
              </div>

              <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white">
                <div>
                  <p className="text-xs text-slate-500 mb-1.5 font-medium">Color Mode</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Full Color
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1.5 font-medium">Sides</p>
                  <p className="font-semibold text-slate-900">Double-sided</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1.5 font-medium">Paper Type</p>
                  <p className="font-semibold text-slate-900">Premium 100gsm</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1.5 font-medium">Copies</p>
                  <p className="font-semibold text-slate-900">2 Sets</p>
                </div>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="flex justify-end pt-2">
            <div className="w-64 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between text-sm mb-3 text-slate-600">
                <span>Subtotal</span>
                <p className="flex items-center gap-0.5 font-bold text-slate-900 text-lg">
                  <IndianRupee className="w-4 h-4" />
                  <span>4.00</span>
                </p>
              </div>
              <div className="flex justify-between text-sm mb-4 text-slate-600">
                <span>Platform Fee</span>
                <p className="flex items-center gap-0.5 font-bold text-slate-900 text-lg">
                  <IndianRupee className="w-4 h-4" />
                  <span>0.50</span>
                </p>
              </div>
              <div className="flex justify-between font-bold text-lg text-slate-900 pt-4 border-t border-slate-100">
                <span>Total Paid</span>
                <p className="flex items-center gap-0.5 font-bold text-slate-900 text-lg">
                  <IndianRupee className="w-4 h-4" />
                  <span>4.5</span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
);

export default ShopDesktopPreview;
