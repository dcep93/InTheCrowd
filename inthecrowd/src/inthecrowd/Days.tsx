import React, { useState } from "react";
import CachedImage from "./CachedImage";
import Slot from "./Slot";
import { DayType } from "./firebase";
import css from "./index.module.css";

type DayProps = {
  getOpacity: (slotKey: string) => number;
  getSelectedColor: (slotKey: string) => string;
  getContents: (slotKey: string) => any;
  imgClick: (dayIndex: number, e: React.MouseEvent) => void;
  slotClick: (dayIndex: number, slotKey: string) => void;
};
export default function Days(props: {
  userId: string;
  days: DayType[];
  dayProps: DayProps;
}) {
  return (
    <div>
      <div className={css.imgs}>
        {props.days.map((day, i) => (
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
        style={{ width: "100vW" }}
        onClick={() => {
          update(!hidden);
          resetZoom();
        }}
      >
        {hidden ? "^" : "_"}
      </div>
      <CachedImage
        src={props.day.img}
        f={(data) => (
          <div className={css.day} hidden={hidden}>
            <img
              className={css.img}
              alt={"missing"}
              src={data}
              onClick={(e) => props.dayProps.imgClick(props.i, e)}
              style={{ width: "100%" }}
            />

            <div>
              {Object.entries(props.day.slots || {}).map(
                ([key, slotCoords]) => (
                  <div
                    key={key}
                    onClick={() => props.dayProps.slotClick(props.i, key)}
                  >
                    <Slot
                      slotCoords={slotCoords}
                      getOpacity={() => props.dayProps.getOpacity(key)}
                      getSelectedColor={() =>
                        props.dayProps.getSelectedColor(key)
                      }
                      getContents={() => props.dayProps.getContents(key)}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      />
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
