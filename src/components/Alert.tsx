function Alert({
  displayText,
  secondaryText,
  variant,
  visible = true,
}: {
  displayText: string;
  secondaryText?: string;
  variant: "info" | "warning" | "error";
  visible?: boolean;
}) {
  return (
    <div
      className={`p-4 text-white rounded-lg transition-opacity duration-200 ${
        variant === "info"
          ? "bg-blue-500/80"
          : variant === "warning"
            ? "bg-yellow-500/80"
            : "bg-red-500/80"
      } ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <p className="text-sm font-semibold">
        {variant === "info" ? "ℹ️" : variant === "warning" ? "⚠️" : "❌"}{" "}
        {displayText}
      </p>
      {secondaryText && <p className="text-sm">{secondaryText}</p>}
    </div>
  );
}

export default Alert;
