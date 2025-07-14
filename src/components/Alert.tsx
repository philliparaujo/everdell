function Alert({
  displayText,
  secondaryDisplay,
  tertiaryDisplay,
  variant,
  visible = true,
}: {
  displayText: string;
  secondaryDisplay?: React.ReactNode;
  tertiaryDisplay?: React.ReactNode;
  variant: "info" | "warning" | "error";
  visible?: boolean;
}) {
  return (
    <div
      className={`p-4 text-white rounded-lg transition-opacity duration-200 ${
        variant === "info"
          ? "bg-blue-500/60"
          : variant === "warning"
            ? "bg-yellow-500/60"
            : "bg-red-500/60"
      } ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <p className="text-base font-semibold">
        {variant === "info" ? "ℹ️" : variant === "warning" ? "⚠️" : "❌"}{" "}
        {displayText}
      </p>
      {secondaryDisplay}
      {tertiaryDisplay}
    </div>
  );
}

export default Alert;
