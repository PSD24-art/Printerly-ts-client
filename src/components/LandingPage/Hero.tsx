import { CheckCircle2, Clock, ShieldCheck, UploadCloud, Zap } from "lucide-react";
import CustomerMobilePreview from "./CustomerMobilePreview";
import Button from "../Utility/Button";
import Badge from "../Utility/Badge";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="pt-5 pb-16 md:pt-10 md:pb-24 overflow-hidden relative bg-slate-50/50">
      {/* Clean Background accents */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-indigo-50/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-teal-50/40 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <Badge variant="teal" className="mb-6 border-transparent bg-teal-100 text-teal-800">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                The new standard for printing
              </span>
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Print anything. <br className="hidden lg:block" /> Without the queue.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Find a nearby print shop, upload your documents, choose your print settings, and place your order straight
              from your phone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                onClick={() => navigate("/register/customer")}
                variant="primary"
                className="w-full sm:w-auto h-12 px-8 text-base"
              >
                Find a Print Shop
              </Button>
              <Button
                onClick={() => navigate("/register/shopkeeper")}
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 text-base bg-transparent"
              >
                I'm a Print Shop
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500" /> Fast service
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-500" /> Secure payments
              </div>
            </div>
          </div>

          {/* Hero Visuals - Product Preview */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none flex justify-center lg:justify-end lg:pr-8">
            <CustomerMobilePreview className="-rotate-2 hover:rotate-0 transition-transform duration-500" />

            {/* Floating UI element 1 */}
            <div className="absolute top-12 -left-4 lg:left-8 bg-white p-3 rounded-xl shadow-lg border border-slate-100 hidden md:flex items-center gap-3">
              <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Order Ready</p>
                <p className="text-[10px] text-slate-500 font-medium">Pick up now</p>
              </div>
            </div>

            {/* Floating UI element 2 */}
            <div className="absolute bottom-24 -right-4 lg:-right-4 bg-white p-3.5 rounded-xl shadow-lg border border-slate-100 hidden md:flex items-center gap-3">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="min-w-[100px]">
                <p className="text-xs font-bold text-slate-900 mb-1.5">Uploading...</p>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-indigo-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
