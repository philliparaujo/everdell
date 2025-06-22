import React from "react";
import { COLORS } from "../colors";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled = false,
  style,
}) => {
  const baseStyle: React.CSSProperties = {
    backgroundColor: COLORS.buttonColor,
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
