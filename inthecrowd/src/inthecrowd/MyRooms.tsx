import React from "react";
import firebase from "./firebase";
import css from "./index.module.css";
import LNav from "./LNav";

export type SlotCoordsType = { x1: number; y1: number; x2: number; y2: number };

export type DayType = {
  img: string;
  width: string;
  slots: { [slotKey: string]: SlotCoordsType };
};

export type UserType = {
  [slotKey: string]: UserSlotType;
};

export type UserSlotType = {
  selected: number;
  location?: { lat: string; long: string; timestamp: number };
};

export type RoomType = {
  users: { [userId: string]: UserType };
  days: DayType[];
  name: string;
  creator: string;
  scheduleId: string;
};

export type ScheduleType = {
  days: DayType[];
  name: string;
  updated: number;
};

class MyRooms extends React.Component<
  { userId: string },
  {
    room: { [roomId: string]: RoomType };
    schedule: { [scheduleId: string]: ScheduleType };
  }
> {
  componentDidMount() {
    firebase.init();
    firebase.connect(this.getFirebasePath(), (val) => this.setState(val || {}));
  }

  getFirebasePath() {
    return `/`;
  }

  render() {
    if (!this.state) return null;
    document.title = "MyRooms";
    return (
      <>
        <LNav />
        <div className={[css.bubble, css.courier].join(" ")}>
          {JSON.stringify(this.state)}
        </div>
      </>
    );
  }
}

export default MyRooms;
