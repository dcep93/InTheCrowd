import React, { RefObject } from "react";
import LNav from "./LNav";
import { getUserId, isAdmin, mapSort, randomKey } from "./Main";
import MyGroups from "./MyGroups";
import firebase, { LineupType, MainType } from "./firebase";
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
                Object.entries(this.state.lineups || {}).map(
                  ([lineupId, lineup]) => ({
                    lineupId,
                    lineup,
                  })
                ),
                (obj) => obj.lineup.updated
              ).map(({ lineupId, lineup }) => (
                <option key={lineupId} value={lineupId}>
                  {lineup.name}#{lineupId}
                </option>
              ))}
              {!isAdmin() ? null : <option value={""}>new lineup</option>}
            </select>
            {!isAdmin() ? null : (
              <button
                onClick={() =>
                  (window.location.href = `/lineup/${
                    this.selectRef.current!.value || randomKey()
                  }`)
                }
              >
                Edit Lineup
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
    const lineupId = this.selectRef.current!.value;
    const lineup = this.state.lineups![lineupId];
    createGroup(this.inputRef.current!.value || lineup.name, lineup);
  }
}

export function createGroup(name: string, lineup: LineupType) {
  const creator = getUserId();
  const id = randomKey().toString();
  const group = {
    id,
    name,
    creator,
    lineup,
    users: {},
  };
  firebase.createGroup(id, group);
  window.location.href = `/group/${id}`;
}

export default NewGroup;
