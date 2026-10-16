import { CheckCircle2, Store, UploadCloud } from "lucide-react";
import SectionHeader from "../Utility/SectionHeader";
const ValueProps = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        badge="The Problem"
        title="Printing shouldn't mean waiting in line."
        subtitle="We replaced traditional USB drives, endless queues, and back-and-forth explanations with a simple, practical digital workflow."
      />

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-16">
        {/* Card 1 */}
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 text-indigo-600">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">Find nearby shops</h3>
          <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
            Discover local print shops on the map, check their available services, operating hours, and pricing upfront
            before you leave.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 text-indigo-600">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">Upload from anywhere</h3>
          <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
            Send your PDF documents directly from your phone or computer. No more struggling with emails, thumb drives,
            or compatibility issues.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 text-indigo-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">Pick up when ready</h3>
          <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
            Track your order status in real-time. Walk in, grab your freshly printed documents, and walk out without the
            wait.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default ValueProps;
