import Badge from "../Utility/Badge";
import { Search, UploadCloud, Settings2, CreditCard } from "lucide-react";
const HowItWorks = () => {
  const steps = [
    { num: "01", title: "Find a shop", desc: "Locate a convenient printer nearby.", icon: Search },
    { num: "02", title: "Upload documents", desc: "Securely send your PDF files.", icon: UploadCloud },
    { num: "03", title: "Choose settings", desc: "Select color, paper, and copies.", icon: Settings2 },
    { num: "04", title: "Place your order", desc: "Pay instantly and track progress.", icon: CreditCard },
  ];

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background element */}
      <div className="absolute top-0 right-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="blue" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 mb-4">
            Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            From file to print in a few simple steps.
          </h2>
        </div>

        <div className="mt-16 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[1px] bg-slate-700 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center mb-6 relative shadow-lg">
                  <div className="absolute -top-3 -right-3 w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {step.num}
                  </div>
                  <step.icon className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 max-w-[200px] mx-auto">{step.desc}</p>

                {/* Mobile connector */}
                {idx !== steps.length - 1 && <div className="md:hidden w-[1px] h-10 bg-slate-700 my-6"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
