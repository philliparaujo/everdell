import React from "react";

type ButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?: "default" | "important" | "danger" | "rare";
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = "default",
  disabled = false,
  className = "",
  style,
}) => {
  const variantClasses = {
    default: "bg-button-default",
    important: "bg-button-important",
    danger: "bg-button-danger",
    rare: "bg-button-rare",
  };

  const baseClasses =
    "text-button-text border border-button-border cursor-pointer disabled:cursor-auto disabled:opacity-40 transition-all duration-100 ease-in-out hover:enabled:scale-[102%] hover:enabled:brightness-105 rounded-[4px] text-sm px-1 py-0";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
