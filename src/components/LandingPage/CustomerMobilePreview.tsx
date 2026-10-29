import { Badge, CheckCircle2, FileText, IndianRupee, MapPin, Search } from "lucide-react";

const CustomerMobilePreview = ({ className = "" }) => (
  <div
    className={`relative mx-auto w-full max-w-[320px] aspect-[1/2.1] bg-slate-50 border-[10px] border-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col ${className}`}
  >
    {/* Phone Notch/Status Bar space */}
    <div className="absolute top-0 inset-x-0 h-6 bg-transparent z-20 flex justify-center">
      <div className="w-1/3 h-5 bg-slate-900 rounded-b-2xl"></div>
    </div>

    {/* App Content */}
    <div className="flex-1 overflow-y-auto pt-10 pb-6 px-4 flex flex-col gap-4 hide-scrollbar relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">Location</p>
          <div className="flex items-center gap-1 text-slate-900">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-sm font-semibold">Pune, MH</span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold border border-indigo-200">
          JD
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-2">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Find print shops..."
          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none shadow-sm pointer-events-none"
          readOnly
        />
      </div>

      {/* Selected Shop */}
      <div className="mt-2">
        <div className="bg-white p-3.5 rounded-xl border border-indigo-200 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-sm text-slate-900">City Print Center</p>
              <p className="text-xs text-slate-500 mt-0.5">0.2 miles away • Open till 8 PM</p>
            </div>
            <Badge fontVariant="teal" className="scale-90 origin-top-right">
              Selected
            </Badge>
          </div>
        </div>
      </div>

      {/* Document Uploaded */}
      <div>
        <h3 className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">Document</h3>
        <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-slate-900 truncate">project-report-final.pdf</p>
            <p className="text-[11px] text-slate-500 mt-0.5">14 pages • 2.4 MB</p>
          </div>
          <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
        </div>
      </div>

      {/* Settings */}
      <div>
        <h3 className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">Settings</h3>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
          <div className="p-3 flex items-center justify-between">
            <span className="text-sm text-slate-700">Color Mode</span>
            <span className="text-[13px] font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">B&W</span>
          </div>
          <div className="p-3 flex items-center justify-between">
            <span className="text-sm text-slate-700">Copies</span>
            <span className="text-[13px] font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">3</span>
          </div>
          <div className="p-3 flex items-center justify-between">
            <span className="text-sm text-slate-700">Paper</span>
            <span className="text-[13px] font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
              Standard A4
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Action Button */}
      <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-sm flex items-center justify-between mt-4">
        <div>
          <p className="text-[11px] font-medium text-slate-500">Total Price</p>
          <p className="flex items-center gap-0.5 font-bold text-slate-900 text-lg">
            <IndianRupee className="w-4 h-4" />
            <span>4</span>
          </p>
        </div>

        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-colors">
          Place Order
        </button>
      </div>
    </div>
  </div>
);

export default CustomerMobilePreview;
