import React, { RefObject } from "react";
import { Button } from "react-bootstrap";
import BaseLineup, { DayType } from "./BaseLineup";
import firebase from "./firebase";
import css from "./index.module.css";
import { randomKey } from "./Main";
import { createRoom } from "./NewRoom";

export type ScheduleType = { days: DayType[]; name: string; updated: number };
class Schedule extends React.Component<
  { scheduleId: string; userId: string },
  ScheduleType
> {
  componentDidMount() {
    firebase.init();
    firebase.connect(this.getFirebasePath(), (val) => this.setState(val || {}));
  }

  getFirebasePath() {
    return `/schedule/${this.props.scheduleId}`;
  }

  updateFirebase() {
    firebase.set(
      this.getFirebasePath(),
      Object.assign({}, this.state, { updated: new Date().getTime() }),
      `${
        this.props.userId
      } ${this.getFirebasePath()} ${new Date().toLocaleString()}`
    );
  }

  inputRef: RefObject<HTMLInputElement> = React.createRef();
  render() {
    if (!this.state) return "loading...";
    document.title = this.state.name || "schedule";
    return (
      <div>
        <div className={css.flex}>
          <div className={css.bubble}>
            <h3>Schedule</h3>
            <TextEditor
              defaultValue={this.state.name || "schedule"}
              submit={(name) => {
                Object.assign(this.state as any, { name });
                this.updateFirebase();
                return false;
              }}
            />
            <div>#{this.props.scheduleId}</div>
            <Button
              onClick={() =>
                createRoom(
                  this.props.scheduleId,
                  this.state.name || "schedule",
                  this.props.userId,
                  this.state.days || []
                )
              }
            >
              Create Room
            </Button>
          </div>
          <div className={css.bubble}>
            <h3>Day Image URLs</h3>
            {(this.state.days || []).map((day, i) => (
              <div key={i} className={css.courier}>
                {i + 1}{" "}
                <TextEditor
                  defaultValue={day.img}
                  submit={(update) => {
                    if (!update) {
                      this.state.days.splice(i, 1);
                    } else {
                      day.img = update;
                    }
                    this.updateFirebase();
                    return true;
                  }}
                />
              </div>
            ))}
            <TextEditor
              defaultValue={""}
              submit={(img) => {
                if (!img) return true;
                if (!this.state.days)
                  Object.assign(this.state as any, { days: [] });
                this.state.days.push({ img, slots: {} });
                this.updateFirebase();
                return true;
              }}
            />
          </div>
        </div>
        <BaseLineup
          userId={this.props.userId}
          days={this.state.days || []}
          imgClick={this.imgClick.bind(this)}
          slotClick={this.slotClick.bind(this)}
          getOpacity={() => 0.4}
          getSelectedColor={() => "black"}
          getContents={() => "*"}
        />
      </div>
    );
  }

  badState?: { dayIndex: number; slotCorner: { x: number; y: number } };
  imgClick(dayIndex: number, e: React.MouseEvent) {
    // @ts-ignore
    const { x, y } = e.target;
    const slotCorner = { x: e.clientX - x, y: e.clientY - y };
    if (dayIndex !== this.badState?.dayIndex) {
      this.badState = { dayIndex, slotCorner };
      return;
    }
    const day = this.state.days[dayIndex];
    if (!day.slots) day.slots = {};
    day.slots[randomKey()] = {
      x1: this.badState.slotCorner.x,
      y1: this.badState.slotCorner.y,
      x2: slotCorner.x,
      y2: slotCorner.y,
    };
    this.badState = undefined;
    this.updateFirebase();
  }

  slotClick(dayIndex: number, slotKey: string) {
    const slots = this.state.days[dayIndex].slots;
    delete slots[slotKey];
    this.updateFirebase();
  }
}

type PropsType = {
  defaultValue: string;
  submit: (update: string) => boolean;
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
          if (this.props.submit(this.inputRef.current!.value)) {
            this.inputRef.current!.value = "";
          }
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

export default Schedule;
