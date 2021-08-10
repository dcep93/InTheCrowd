import React, { RefObject } from "react";
import firebase, { MainType, ScheduleType } from "./firebase";
import css from "./index.module.css";
import LNav from "./LNav";
import { getUserId, mapSort, randomKey } from "./Main";
import MyRooms from "./MyRooms";

class NewRoom extends React.Component<{}, MainType> {
  componentDidMount() {
    firebase.connectMain(this.setState.bind(this));
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
              {mapSort(
                Object.entries(this.state.schedules || {}).map(
                  ([scheduleId, schedule]) => ({
                    scheduleId,
                    schedule,
                  })
                ),
                (obj) => obj.schedule.updated
              ).map(({ scheduleId, schedule }) => (
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
              <input type={"text"} ref={this.inputRef} defaultValue={""} />
              <button
                onClick={this.createRoom.bind(this)}
                disabled={this.selectRef.current?.value === ""}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
        <MyRooms main={this.state} />
      </>
    );
  }

  createRoom() {
    const scheduleId = this.selectRef.current!.value;
    const schedule = this.state.schedules![scheduleId];
    createRoom(this.inputRef.current!.value || schedule.name, schedule);
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
