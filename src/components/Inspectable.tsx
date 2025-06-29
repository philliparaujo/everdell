import { COLORS } from "../colors";

function Inspectable({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.inspectBackground,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          display: "flex",
          gap: "32px",
          backgroundColor: COLORS.inspect,
          padding: "24px",
          borderRadius: "12px",
          maxWidth: "80%",
          maxHeight: "80%",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Inspectable;
