import React, { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "accent" | "logout";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const Button = ({ children, variant = "primary", className = "", ...props }: ButtonProps): React.JSX.Element => {
  // Fixed return type annotation
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl px-5 py-2.5 text-sm active:scale-[0.98]";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    accent: "bg-teal-500 text-white hover:bg-teal-600 shadow-sm",
    logout: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
