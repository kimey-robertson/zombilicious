import React, { JSX } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variants: Record<string, string> = {
  default: "bg-blue-600 text-white hover:bg-blue-500",
  destructive: "bg-red-600 text-white hover:bg-red-500",
  outline: "border border-gray-300 bg-white text-black hover:bg-gray-100",
  secondary: "bg-gray-100 text-black hover:bg-gray-200",
  ghost: "bg-transparent text-black hover:bg-gray-100",
  link: "text-blue-600 underline hover:no-underline",
};

const sizes: Record<string, string> = {
  default: "h-9 px-4 py-2",
  sm: "h-8 px-3 text-sm",
  lg: "h-10 px-6 text-base",
  icon: "h-9 w-9 p-0",
};

type ButtonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
} & React.HTMLAttributes<Element>;

export function Button({
  variant = "default",
  size = "default",
  as: Component = "button",
  className = "",
  ...props
}: ButtonProps) {
  const classes = [base, variants[variant] || "", sizes[size] || "", className]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes} {...props} />;
}
