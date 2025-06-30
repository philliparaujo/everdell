import { Link } from "react-router-dom";
import { COLORS } from "../colors";

function Navigation({
  link,
  displayText,
  arrow,
}: {
  link: string;
  displayText: string;
  arrow: "forward" | "backward" | "none";
}) {
  const arrowSymbol =
    arrow === "backward" ? "← " : arrow === "forward" ? "→ " : "";

  return (
    <div>
      <Link
        to={link}
        className="no-underline"
        style={{ color: COLORS.navigationText }}
      >
        {arrow === "forward"
          ? `${displayText} ${arrowSymbol}`
          : `${arrowSymbol}${displayText}`}
      </Link>
    </div>
  );
}

export default Navigation;
