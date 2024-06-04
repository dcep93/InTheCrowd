import React, { RefObject } from "react";
import LNav from "./LNav";
import { getUserId, isAdmin, mapSort, randomKey } from "./Main";
import MyGroups from "./MyGroups";
import firebase, { MainType, ScheduleType } from "./firebase";
import css from "./index.module.css";

class NewGroup extends React.Component<{}, MainType> {
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
              {!isAdmin() ? null : <option value={""}>new schedule</option>}
            </select>
            {!isAdmin() ? null : (
              <button
                onClick={() =>
                  (window.location.href = `/schedule/${
                    this.selectRef.current!.value || randomKey()
                  }`)
                }
              >
                Edit Schedule
              </button>
            )}
            <div>
              <input type={"text"} ref={this.inputRef} defaultValue={""} />
              <button
                onClick={this.createGroup.bind(this)}
                disabled={this.selectRef.current?.value === ""}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
        <MyGroups main={this.state} />
      </>
    );
  }

  createGroup() {
    const scheduleId = this.selectRef.current!.value;
    const schedule = this.state.schedules![scheduleId];
    createGroup(this.inputRef.current!.value || schedule.name, schedule);
  }
}

export function createGroup(name: string, schedule: ScheduleType) {
  const creator = getUserId();
  const id = randomKey().toString();
  const group = {
    id,
    name,
    creator,
    schedule,
    users: {},
  };
  firebase.createGroup(id, group);
  window.location.href = `/group/${id}`;
}

export default NewGroup;
