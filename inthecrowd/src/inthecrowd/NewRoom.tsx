import React, { RefObject } from "react";
import firebase, { ScheduleType } from "./firebase";
import css from "./index.module.css";
import LNav from "./LNav";
import { getUserId, randomKey } from "./Main";

class NewRoom extends React.Component<
  {},
  { [scheduleId: string]: ScheduleType }
> {
  componentDidMount() {
    firebase.connectSchedules(this.setState.bind(this));
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
              {Object.entries(this.state)
                .map(([scheduleId, schedule]) => ({ scheduleId, schedule }))
                .sort((a, b) => b.schedule.updated - a.schedule.updated)
                .map(({ scheduleId, schedule }) => (
                  <option key={scheduleId} value={scheduleId}>
                    {schedule.name}#{scheduleId}
                  </option>
                ))}
              <option value={""}>new schedule</option>
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
    createRoom(this.inputRef.current!.value, schedule);
  }
}

export function createRoom(name: string, schedule: ScheduleType) {
  const creator = getUserId();
  const id = randomKey().toString();
  const room = {
    id,
    name,
    days: schedule.days,
    creator,
    schedule,
    users: {},
  };
  firebase.createRoom(id, room);
  window.location.href = `/room/${id}`;
}

export default NewRoom;
