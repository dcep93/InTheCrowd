import React, { useState } from "react";
import css from "./index.module.css";
import { DayType } from "./MyRooms";
import Slot from "./Slot";

type DayProps = {
  getOpacity: (slotKey: string) => number;
  getSelectedColor: (slotKey: string) => string;
  getContents: (slotKey: string) => any;
  imgClick: (dayIndex: number, e: React.MouseEvent) => void;
  slotClick: (dayIndex: number, slotKey: string) => void;
};
function Lineup(props: {
  userId: string;
  days: DayType[];
  dayProps: DayProps;
}) {
  return (
    <div>
      <div className={css.imgs}>
        {(props.days || []).map((day, i) => (
          <Day key={i} dayProps={props.dayProps} i={i} day={day} />
        ))}
      </div>
    </div>
  );
}

function Day(props: { i: number; day: DayType; dayProps: DayProps }) {
  const [hidden, update] = useState(false);
  return (
    <div>
      <div
        className={css.hideDay}
        style={{ width: props.day.width }}
        onClick={() => {
          update(!hidden);
          resetZoom();
        }}
      >
        {hidden ? "^" : "_"}
      </div>
      <div className={css.day} hidden={hidden}>
        <img
          alt={"missing"}
          src={props.day.img}
          onClick={(e) => props.dayProps.imgClick(props.i, e)}
          style={{ width: props.day.width }}
        />
        <div>
          {Object.entries(props.day.slots || []).map(([key, slotCoords]) => (
            <div
              key={key}
              onClick={() => props.dayProps.slotClick(props.i, key)}
            >
              <Slot
                slotCoords={slotCoords}
                getOpacity={() => props.dayProps.getOpacity(key)}
                getSelectedColor={() => props.dayProps.getSelectedColor(key)}
                getContents={() => props.dayProps.getContents(key)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function resetZoom() {
  const viewport = document.querySelector('meta[name="viewport"]');

  if (viewport) {
    // @ts-ignore
    viewport.content = "initial-scale=1";
    // @ts-ignore
    viewport.content = "width=device-width";
  }
}

export default Lineup;
