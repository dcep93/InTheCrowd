import React, { ReactElement, useState } from "react";
import firebase from "./firebase";
import Lineup, { DayType } from "./Lineup";
import SlotSelectModal from "./SlotSelectModal";

const MAX_VOTES = 2;

type UserType = {
  [slotKey: string]: UserSlotType;
};
type UserSlotType = {
  selected: number;
  location?: { lat: string; long: string; timestamp: number };
};
type UserDictSlotType = { [userId: string]: UserSlotType };

class BaseRoom extends React.Component<
  { roomId: string; userId: string; readOnly?: boolean },
  {
    users: { [userId: string]: UserType };
    days: DayType[];
    name: string;
    creator: string;
    scheduleId: string;
  }
> {
  componentDidMount() {
    firebase.init();
    firebase.connect(this.getFirebasePath(), (val) => this.setState(val || {}));
  }

  getFirebasePath() {
    return `/room/${this.props.roomId}`;
  }

  updateMyFirebase() {
    const path = `${this.getFirebasePath()}/users/${this.props.userId}`;
    firebase.set(
      path,
      this.getMe(),
      `${this.props.userId} ${path} ${new Date().toLocaleString()}`
    );
  }

  render() {
    if (!this.state) return "loading...";
    document.title = this.state.name;
    return (
      <>
        <Lineup
          userId={this.props.userId}
          days={this.state.days}
          imgClick={() => null}
          slotClick={this.slotClick.bind(this)}
          getOpacity={this.getOpacity.bind(this)}
          getSelectedColor={this.getSelectedColor.bind(this)}
          getContents={this.getContents.bind(this)}
        />
      </>
    );
  }

  slotClick(dayIndex: number, slotKey: string) {
    if (this.props.readOnly) return;
    const me = this.getMe();
    if (!me[slotKey]) me[slotKey] = { selected: 0 };
    me[slotKey].selected = (me[slotKey].selected + 1) % (MAX_VOTES + 1);
    this.updateMyFirebase();
  }

  getUserDictSlot(key: string): UserDictSlotType {
    return Object.fromEntries(
      Object.entries(this.state.users || {})
        .map(([userId, userSlots]) => ({
          userId,
          obj: userSlots[key]!,
        }))
        .filter(({ obj }) => obj?.selected > 0 || obj?.location)
        .map(({ userId, obj }) => [userId, obj])
    );
  }

  getMe(): UserType {
    const s = this.state as any;
    if (!s.users) s.users = {};
    if (!s.users[this.props.userId]) s.users[this.props.userId] = {};
    return s.users[this.props.userId];
  }

  shareLocation(slotKey: string) {
    if (this.props.readOnly) return;
    if (!navigator.geolocation) return alert("cannot get geolocation");
    const me = this.getMe();
    navigator.geolocation.getCurrentPosition((position) => {
      me[slotKey] = Object.assign(me[slotKey], {
        location: {
          lat: position.coords.latitude,
          long: position.coords.longitude,
          timestamp: position.timestamp,
        },
      });
      this.updateMyFirebase();
    });
  }

  getMySelected(slotKey: string): number {
    return this.getMe()[slotKey]?.selected || 0;
  }

  getOpacity(slotKey: string): number {
    const minOpacity = 0.2;
    const maxOpacity = 0.5;
    const mySelected = this.getMySelected(slotKey);
    const selected = this.getTotalSelected(slotKey);
    const selectedOpacity =
      Math.min(selected / 6, 1) * (maxOpacity - minOpacity) + minOpacity;
    if (mySelected > 0) {
      const opacity =
        (mySelected / MAX_VOTES) * (maxOpacity - minOpacity) + minOpacity;
      if (selected > mySelected) {
        return (selectedOpacity + opacity) / 2;
      } else {
        return opacity;
      }
    } else {
      if (selected > 0) {
        return selectedOpacity;
      } else {
        return 0;
      }
    }
  }

  getTotalSelected(slotKey: string): number {
    return Object.values(this.getUserDictSlot(slotKey))
      .map((s) => s.selected || 0)
      .reduce((a, b) => a + b, 0);
  }

  getSelectedColor(slotKey: string): string {
    const mySelected = this.getMySelected(slotKey);
    const totalSelected = this.getTotalSelected(slotKey);
    if (mySelected > 0) {
      if (totalSelected > mySelected) {
        return "blue";
      } else {
        return "black";
      }
    } else {
      if (totalSelected > 0) {
        return "red";
      } else {
        return "";
      }
    }
  }

  getContents(slotKey: string): any {
    return (
      <GetContents
        contents={`${this.getMySelected(slotKey)}/${this.getTotalSelected(
          slotKey
        )}`}
        shareLocation={() => this.shareLocation(slotKey)}
        modalContents={this.getModalContents(slotKey)}
      />
    );
  }

  getModalContents(slotKey: string): any {
    return (
      <>
        {Object.entries(this.getUserDictSlot(slotKey)).map(
          ([userId, selected]) => (
            <div key={userId}>
              {userId} {selected.selected}{" "}
              {selected.location && (
                <a
                  href={`https://maps.google.com?q=${selected.location.lat},${selected.location.long}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {new Date(selected.location.timestamp).toLocaleTimeString()}
                </a>
              )}
            </div>
          )
        )}
      </>
    );
  }
}

function GetContents(props: {
  contents: string;
  shareLocation: () => void;
  modalContents: ReactElement;
}) {
  const [show, update] = useState(false);
  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          update(true);
        }}
      >
        {props.contents}
      </div>
      <SlotSelectModal
        show={show}
        onHide={() => update(false)}
        shareLocation={props.shareLocation}
        modalContents={props.modalContents}
      />
    </>
  );
}

export default BaseRoom;
