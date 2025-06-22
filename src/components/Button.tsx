import React from "react";
import { COLORS } from "../colors";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  color = COLORS.buttonColor,
  disabled = false,
  style,
}) => {
  const baseStyle: React.CSSProperties = {
    backgroundColor: color,
    color: COLORS.buttonText,
    border: `solid 1px ${COLORS.buttonBorder}`,
    borderRadius: "4px",
    cursor: "pointer",
    opacity: 1,
    ...style,
  };

  const disabledStyle: React.CSSProperties = {
    backgroundColor: "#555", // dim background
    color: "#999", // faded text
    border: `solid 1px #666`,
    opacity: 0.6,
    cursor: "auto",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={disabled ? { ...baseStyle, ...disabledStyle } : baseStyle}
    >
      {children}
    </button>
  );
};

export default Button;
