type BadgeVariant = "gray" | "green" | "amber" | "blue" | "teal";

interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge = ({ children, variant = "gray", className = "" }: BadgeProps) => {
  const variants: Record<BadgeVariant, string> = {
    gray: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-indigo-50 text-indigo-700 border-indigo-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
