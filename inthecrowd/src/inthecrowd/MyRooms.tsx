import React, { RefObject } from "react";
import { Button } from "react-bootstrap";
import firebase from "./firebase";
import css from "./index.module.css";
import LNav from "./LNav";
import { getUserId } from "./Main";

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
  scheduleUpdated: number;
};

export type ScheduleType = {
  days: DayType[];
  name: string;
  updated: number;
};

class MyRooms extends React.Component<
  {},
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
    document.title = "InTheCrowd";
    const userId = getUserId();
    return (
      <>
        <LNav />
        {Object.entries(this.state.room)
          .filter(
            ([roomId, room]) =>
              room.creator === userId || (room.users || {})[userId]
          )
          .map(([roomId, room]) => (
            <div key={roomId} className={css.bubble}>
              <div>
                <a href={`/room/${roomId}`}>#{roomId}</a>
              </div>
              <div>by {room.creator}</div>
              <div>
                <TextEditor
                  defaultValue={room.name}
                  submit={(val) => firebase.set(`/room/${roomId}/name`, val)}
                />
              </div>
              <div className={css.bubble}>
                <h5>{this.state.schedule[room.scheduleId].name}</h5>
                <Button
                  disabled={
                    this.state.schedule[room.scheduleId].updated ===
                    room.scheduleUpdated
                  }
                  onClick={() =>
                    firebase.set(`/room/${roomId}`, {
                      days: this.state.schedule[room.scheduleId].days,
                      scheduleUpdated:
                        this.state.schedule[room.scheduleId].updated,
                    })
                  }
                >
                  Update Days From Schedule
                </Button>
              </div>
            </div>
          ))}
      </>
    );
  }
}

type PropsType = {
  defaultValue: string;
  submit: (val: string) => void;
};
class TextEditor extends React.Component<PropsType> {
  inputRef: RefObject<HTMLInputElement>;
  constructor(props: PropsType) {
    super(props);
    this.inputRef = React.createRef();
  }

  render() {
    return (
      <form
        className={css.inline}
        onSubmit={(e) => {
          e.preventDefault();
          this.props.submit(this.inputRef.current!.value);
          return false;
        }}
      >
        <input
          type={"text"}
          ref={this.inputRef}
          defaultValue={this.props.defaultValue}
        />
      </form>
    );
  }
}

export default MyRooms;
