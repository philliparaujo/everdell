import React, { useState } from "react";
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
  const [hovered, setHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    backgroundColor: color,
    color: COLORS.buttonText,
    border: `solid 1px ${COLORS.buttonBorder}`,
    cursor: disabled ? "auto" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "transform 0.1s ease, filter 0.1s ease",
    transform: hovered && !disabled ? "scale(1.02)" : "scale(1)",
    filter: hovered && !disabled ? "brightness(1.05)" : "none",
    ...style,
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={baseStyle}
      className="rounded-4px text-sm px-1 py-0"
    >
      {children}
    </button>
  );
};

export default Button;
