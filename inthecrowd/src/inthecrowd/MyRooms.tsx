import React, { RefObject } from "react";
import { Button } from "react-bootstrap";
import firebase, { MainType } from "./firebase";
import css from "./index.module.css";
import { getUserId, mapSort } from "./Main";

class MyRooms extends React.Component<{}, MainType> {
  componentDidMount() {
    firebase.connectMain(this.setState.bind(this));
  }

  render() {
    if (!this.state) return null;
    document.title = "InTheCrowd";
    const userId = getUserId();
    return (
      <div>
        {mapSort(
          Object.values(this.state.rooms || {}).filter(
            (room) => room.creator === userId || (room.users || {})[userId]
          ),
          (room) => room.schedule.updated
        ).map((room) => (
          <div key={room.id} className={css.bubble}>
            <div>
              <TextEditor
                defaultValue={room.name}
                submit={(val) => firebase.setRoomName(room.id, val)}
              />
            </div>
            <div>
              <a href={`/room/${room.id}`}>#{room.id}</a>
            </div>
            <div>by {room.creator}</div>
            <div className={css.bubble}>
              <h5>{room.schedule.name}</h5>
              <a href={`/schedule/${room.schedule.id}`}>#{room.schedule.id}</a>
              <div>
                <Button
                  disabled={
                    (this.state.schedules || {})[room.schedule.id].updated ===
                    room.schedule.updated
                  }
                  onClick={() =>
                    firebase.setRoomSchedule(
                      room.id,
                      (this.state.schedules || {})[room.schedule.id]
                    )
                  }
                >
                  Update Days From Schedule
                </Button>
              </div>
            </div>
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

export default MyRooms;
