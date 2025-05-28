import { EffectType } from "../engine/gameTypes";
import bluetype from "../assets/icons/bluetype.png";
import greentype from "../assets/icons/greentype.png";
import purpletype from "../assets/icons/purpletype.png";
import redtype from "../assets/icons/redtype.png";
import tantype from "../assets/icons/tantype.png";
import { iconStyle } from "./ResourceIcon";

const effectTypeIcons: Record<EffectType, string> = {
  Blue: bluetype,
  Green: greentype,
  Purple: purpletype,
  Red: redtype,
  Tan: tantype
}

export function EffectTypeIcon({ type }: { type: EffectType }) {
  return (
    <img
      src={effectTypeIcons[type]}
      alt={type.toString()}
      style={iconStyle}
    />
  )
}