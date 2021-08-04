import React, { RefObject } from "react";
import firebase from "./firebase";
import css from "./index.module.css";
import LNav from "./LNav";
import { getUserId, randomKey } from "./Main";
import { DayType, ScheduleType } from "./MyRooms";

class NewRoom extends React.Component<
  {},
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
    firebase.set(this.getFirebasePath(), this.state);
  }

  selectRef: RefObject<HTMLSelectElement> = React.createRef();
  inputRef: RefObject<HTMLInputElement> = React.createRef();
  render() {
    if (!this.state) return "loading...";
    document.title = "InTheCrowd";
    return (
      <>
        <LNav />
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
      </>
    );
  }

  createRoom() {
    const scheduleId = this.selectRef.current!.value;
    const schedule = this.state[scheduleId];
    createRoom(
      scheduleId,
      this.inputRef.current!.value,
      schedule.days || [],
      schedule.updated
    );
  }
}

export function createRoom(
  scheduleId: string,
  name: string,
  days: DayType[],
  scheduleUpdated: number
) {
  const creator = getUserId();
  const room = {
    name,
    days,
    creator,
    scheduleId,
    scheduleUpdated,
  };
  const roomId = randomKey();
  firebase.set(`/room/${roomId}`, room, `create`);
  window.location.href = `/room/${roomId}`;
}

export default NewRoom;
