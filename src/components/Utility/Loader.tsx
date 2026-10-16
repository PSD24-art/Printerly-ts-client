const Loader = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5">
        {/* Spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-600" />
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-800">Loading Printerly</p>

          <p className="mt-1 text-xs text-slate-500">Getting things ready for you...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
