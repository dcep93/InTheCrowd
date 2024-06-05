import { SlotCoordsType } from "./firebase";
import css from "./index.module.css";

function Slot(props: {
  slotCoords: SlotCoordsType;
  getOpacity: () => number;
  getSelectedColor: () => string;
  getContents: () => any;
}) {
  return (
    <>
      <div
        className={css.slotWrapper}
        style={{
          left: `${props.slotCoords.x}%`,
          top: `${props.slotCoords.y}%`,
          width: `${props.slotCoords.width}%`,
          height: `${props.slotCoords.height}%`,
        }}
      >
        <div
          className={css.slot}
          style={{
            opacity: props.getOpacity(),
            backgroundColor: props.getSelectedColor(),
          }}
        ></div>

        <div className={css.slotCount}>{props.getContents()}</div>
      </div>
    </>
  );
}

export default Slot;
