import React, { RefObject } from "react";
import { Button } from "react-bootstrap";
import firebase, { MainType } from "./firebase";
import css from "./index.module.css";
import LNav from "./LNav";
import { getUserId } from "./Main";

class MyRooms extends React.Component<{}, MainType> {
  componentDidMount() {
    firebase.connectMain(this.setState.bind(this));
  }

  render() {
    if (!this.state) return null;
    document.title = "InTheCrowd";
    const userId = getUserId();
    return (
      <>
        <LNav />
        {Object.entries(this.state.rooms || {})
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
                  submit={(val) => firebase.setRoomName(roomId, val)}
                />
              </div>
              <div className={css.bubble}>
                <h5>{room.schedule.name}</h5>
                <Button
                  disabled={
                    (this.state.schedules || {})[room.schedule.id].updated ===
                    room.schedule.updated
                  }
                  onClick={() =>
                    firebase.setRoomSchedule(
                      roomId,
                      (this.state.schedules || {})[room.schedule.id]
                    )
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
