import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 dark:shadow-indigo-500/10 focus-visible:ring-indigo-500",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700/80 dark:text-gray-200 dark:hover:bg-gray-600/80 focus-visible:ring-gray-400",
    outline:
      "border border-gray-200 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200 focus-visible:ring-gray-400",
    danger:
      "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 focus-visible:ring-red-500",
  };

  const sizes = {
    sm: "h-9 sm:h-8 px-3 text-xs",
    md: "h-11 sm:h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
  };

  // Check if className contains responsive display utilities
  const hasResponsiveDisplay =
    /\b(hidden|flex|block|inline|grid|(?:xs|sm|md|lg|xl|2xl):(hidden|flex|block|inline|grid))\b/.test(
      className,
    );
  const displayClass = hasResponsiveDisplay ? "" : "inline-flex";

  return (
    <button
      className={`${displayClass} ${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
