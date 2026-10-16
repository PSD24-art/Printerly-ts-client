import { CheckCircle2, Monitor, Smartphone } from "lucide-react";
import SectionHeader from "../Utility/SectionHeader";

const ComparisonSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title="Built for both sides of the counter."
        subtitle="One platform connecting local demand with local capability."
      />

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        {/* Customer Column */}
        <div className="bg-indigo-50/50 rounded-2xl p-8 border border-indigo-100">
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900">Simple for Customers</h3>
          </div>
          <ul className="space-y-4">
            {[
              "Find nearest shop with live status",
              "Upload PDF directly from phone",
              "Configure exact print settings",
              "Track order and pick up seamlessly",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Shop Column */}
        <div className="bg-teal-50/50 rounded-2xl p-8 border border-teal-100">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="w-6 h-6 text-teal-600" />
            <h3 className="text-xl font-bold text-slate-900">Organized for Shops</h3>
          </div>
          <ul className="space-y-4">
            {[
              "Receive pre-paid digital orders",
              "Review PDFs before accepting",
              "Organized desktop queue management",
              "Automated customer status updates",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default ComparisonSection;
