const FinalCTA = () => (
  <section className="py-24 bg-indigo-600 text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Your next print job starts here.</h2>
      <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
        Find a print shop and send your documents before you arrive. Fast, secure, and hassle-free.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          Find a Print Shop
        </button>
        <button className="w-full sm:w-auto px-8 py-3.5 bg-indigo-700 text-white border border-indigo-500 font-bold rounded-xl hover:bg-indigo-800 transition-all">
          Register Your Shop
        </button>
      </div>
    </div>
  </section>
);
export default FinalCTA;
