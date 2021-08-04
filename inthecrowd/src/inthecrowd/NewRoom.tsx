import React, { RefObject } from "react";
import { DayType } from "./BaseLineup";
import firebase from "./firebase";
import css from "./index.module.css";
import { randomKey } from "./Main";
import { ScheduleType } from "./Schedule";

class NewRoom extends React.Component<
  { userId: string },
  { [scheduleId: string]: ScheduleType }
> {
  componentDidMount() {
    firebase.init();
    firebase.connect(this.getFirebasePath(), (val) => this.setState(val || {}));
  }

  getFirebasePath() {
    return `/schedule`;
  }

  updateFirebase() {
    firebase.set(
      this.getFirebasePath(),
      this.state,
      `${
        this.props.userId
      } ${this.getFirebasePath()} ${new Date().toLocaleString()}`
    );
  }

  selectRef: RefObject<HTMLSelectElement> = React.createRef();
  inputRef: RefObject<HTMLInputElement> = React.createRef();
  render() {
    if (!this.state) return "loading...";
    document.title = "InTheCrowd";
    return (
      <div className={css.flex}>
        <div className={css.bubble}>
          <select ref={this.selectRef} onChange={() => this.forceUpdate()}>
            <option value={""}>new schedule</option>
            {Object.entries(this.state)
              .map(([scheduleId, schedule]) => ({ scheduleId, schedule }))
              .sort((a, b) => b.schedule.updated - a.schedule.updated)
              .map(({ scheduleId, schedule }) => (
                <option key={scheduleId} value={scheduleId}>
                  {schedule.name}#{scheduleId}
                </option>
              ))}
          </select>
          <button
            onClick={() =>
              (window.location.href = `/schedule/${
                this.selectRef.current!.value || randomKey()
              }`)
            }
          >
            Edit Schedule
          </button>
          <div>
            <input
              type={"text"}
              ref={this.inputRef}
              defaultValue={"InTheCrowd"}
            />
            <button
              onClick={this.createRoom.bind(this)}
              disabled={!this.selectRef.current?.value}
            >
              Create Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  createRoom() {
    const scheduleId = this.selectRef.current!.value;
    createRoom(
      scheduleId,
      this.inputRef.current!.value,
      this.props.userId,
      this.state[scheduleId].days || []
    );
  }
}

export function createRoom(
  scheduleId: string,
  name: string,
  creator: string,
  days: DayType[]
) {
  const room = {
    name,
    days,
    creator,
    scheduleId,
  };
  const roomId = randomKey();
  firebase.set(
    `/room/${roomId}`,
    room,
    `${creator} create room ${new Date().toLocaleString()}`
  );
  window.location.href = `/room/${roomId}`;
}

export default NewRoom;
