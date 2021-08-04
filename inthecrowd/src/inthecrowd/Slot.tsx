import React from "react";
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
          left: props.slotCoords.x1,
          top: props.slotCoords.y1,
          width: props.slotCoords.x2 - props.slotCoords.x1,
          height: props.slotCoords.y2 - props.slotCoords.y1,
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
