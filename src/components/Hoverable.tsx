import { useState, ReactNode } from "react";

function Hoverable({
  children,
  isInteractive,
  onLeftClick,
  onRightClick,
  style,
}: {
  children: React.ReactNode;
  isInteractive: boolean;
  onLeftClick?: () => void;
  onRightClick?: (setInspectingFalse: () => void) => ReactNode;
  style?: React.CSSProperties;
}) {
  const [inspecting, setInspecting] = useState(false);
  const [hovering, setHovering] = useState(false);

  const closeInspector = () => setInspecting(false);

  return (
    <>
      <span
        onMouseEnter={() => setHovering(true && isInteractive)}
        onMouseLeave={() => setHovering(false)}
        onMouseDown={(e) => {
          if (e.button !== 0 || inspecting || onLeftClick === undefined) return;
          onLeftClick();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setInspecting(true && isInteractive);
          setHovering(false);
        }}
        style={{
          cursor: isInteractive ? "pointer" : "default",
          transition: "transform 0.1s ease, filter 0.1s ease",
          transform: isInteractive && hovering ? "scale(1.02)" : "scale(1)",
          filter:
            isInteractive && hovering ? "brightness(1.10)" : "brightness(1)",
          ...style,
        }}
      >
        {children}
      </span>

      {inspecting && onRightClick && onRightClick(closeInspector)}
    </>
  );
}

export default Hoverable;
