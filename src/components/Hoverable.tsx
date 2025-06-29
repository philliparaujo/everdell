import { useState } from "react";

function Hoverable({
  children,
  isInteractive,
  onLeftClick,
  onRightClick,
}: {
  children: React.ReactNode;
  isInteractive: boolean;
  onLeftClick?: () => void;
  onRightClick?: (setInspectingFalse: () => void) => void;
}) {
  const [inspecting, setInspecting] = useState(false);
  const [hovering, setHovering] = useState(false);

  const closeInspector = () => setInspecting(false);

  return (
    <>
      <div
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
          transform: hovering ? "scale(1.02)" : "scale(1)",
          filter: hovering ? "brightness(1.05)" : "brightness(1)",
        }}
      >
        {children}
      </div>

      {inspecting && onRightClick && onRightClick(closeInspector)}
    </>
  );
}

export default Hoverable;
