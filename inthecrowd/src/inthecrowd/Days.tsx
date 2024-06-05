import React, { useState } from "react";
import CachedImage from "./CachedImage";
import Slot from "./Slot";
import { DayType } from "./firebase";
import css from "./index.module.css";

type DayProps<T> = {
  getOpacity: (slotKey: string) => number;
  getSelectedColor: (slotKey: string) => string;
  getContents: (slotKey: string) => any;
  imgClick: (t: T, dayIndex: number, e: React.MouseEvent) => T;
  slotClick: (dayIndex: number, slotKey: string) => void;
};
export default function Days<T>(props: {
  userId: string;
  days: DayType[];
  dayProps: DayProps<T>;
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

function Day<T>(props: { i: number; day: DayType; dayProps: DayProps<T> }) {
  const [prev, updatePrev] = useState<T>(undefined as T);
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
              onClick={(e) =>
                updatePrev(props.dayProps.imgClick(prev, props.i, e))
              }
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
