import React, { RefObject } from "react";
import { Button } from "react-bootstrap";
import { getUserId, mapSort } from "./Main";
import firebase, { MainType } from "./firebase";
import css from "./index.module.css";

class MyGroups extends React.Component<{ main: MainType }> {
  render() {
    const userId = getUserId();
    return (
      <div>
        {mapSort(
          Object.values(this.props.main.groups || {}).filter(
            (group) => group.creator === userId || (group.users || {})[userId]
          ),
          (group) => group.schedule.updated
        ).map((group) => (
          <div key={group.id} className={css.bubble}>
            <div>
              <TextEditor
                defaultValue={group.name}
                submit={(val) => firebase.setGroupName(group.id, val)}
              />
            </div>
            <div>
              <a href={`/group/${group.id}`}>group #{group.id}</a>
            </div>
            <div>by {group.creator}</div>
            {group.schedule.creator !== userId ? null : (
              <div className={css.bubble}>
                <h5>{group.schedule.name}</h5>
                <a href={`/schedule/${group.schedule.id}`}>
                  schedule #{group.schedule.id}
                </a>
                <div>
                  <Button
                    disabled={
                      (this.props.main.schedules || {})[group.schedule.id]
                        .updated === group.schedule.updated
                    }
                    onClick={() =>
                      firebase.setGroupSchedule(
                        group.id,
                        (this.props.main.schedules || {})[group.schedule.id]
                      )
                    }
                  >
                    Update Days From Schedule
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
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

export default MyGroups;
