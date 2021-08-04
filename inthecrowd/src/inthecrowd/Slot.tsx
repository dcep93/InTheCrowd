import React from "react";
import css from "./index.module.css";

export type SlotCoordsType = { x1: number; y1: number; x2: number; y2: number };
export type UserSlotType = {
  selected: number;
  location?: { lat: string; long: string; timestamp: number };
};
export type UserDictSlotType = { [userId: string]: UserSlotType };
class Slot extends React.Component<{
  slotCoords: SlotCoordsType;
  getOpacity: () => number;
  getSelectedColor: () => string;
  getContents: () => any;
}> {
  render() {
    return (
      <>
        <div
          className={css.slotWrapper}
          style={{
            left: this.props.slotCoords.x1,
            top: this.props.slotCoords.y1,
            width: this.props.slotCoords.x2 - this.props.slotCoords.x1,
            height: this.props.slotCoords.y2 - this.props.slotCoords.y1,
          }}
        >
          <div
            className={css.slot}
            style={{
              opacity: this.props.getOpacity(),
              backgroundColor: this.props.getSelectedColor(),
            }}
          ></div>

          <div className={css.slotCount}>{this.props.getContents()}</div>
        </div>
      </>
    );
  }
}

export default Slot;
