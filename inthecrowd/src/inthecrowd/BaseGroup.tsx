import React, { ReactElement, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import firebase, {
  GroupType,
  ScheduleType,
  UserSlotType,
  UserType,
} from "./firebase";
import Lineup from "./Lineup";

const MAX_VOTES = 3;

class BaseGroup extends React.Component<
  { groupId: string; userId: string; readOnly?: boolean },
  GroupType
> {
  componentDidMount() {
    firebase.connectGroup(this.props.groupId, this.setState.bind(this));
  }

  updateMyFirebase() {
    firebase.updateGroupUser(
      this.props.groupId,
      this.props.userId,
      this.getMe()
    );
  }

  render() {
    if (!this.state) return "loading...";
    document.title = this.state.name;
    return (
      <>
        <Lineup
          userId={this.props.userId}
          days={this.state.schedule.days || []}
          dayProps={{
            imgClick: () => null,
            slotClick: this.slotClick.bind(this),
            getOpacity: this.getOpacity.bind(this),
            getSelectedColor: (slotKey) =>
              this.getSelectedColor(slotKey, this.state.schedule),
            getContents: this.getContents.bind(this),
          }}
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

  getUserDictSlot(key: string): { [userId: string]: UserSlotType } {
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
    const s = this.state as GroupType;
    if (!s.users) s.users = {};
    if (!s.users[this.props.userId]) s.users[this.props.userId] = {};
    return s.users[this.props.userId];
  }

  location(slotKey: string) {
    return (
      <Modal.Footer>
        {this.getMe()[slotKey]?.location && (
          <Button onClick={() => this.hideLocation(slotKey)}>
            Hide Location
          </Button>
        )}
        <Button onClick={() => this.shareLocation(slotKey)}>
          Share Location
        </Button>
      </Modal.Footer>
    );
  }

  shareLocation(slotKey: string) {
    if (!navigator.geolocation) return alert("cannot get geolocation");
    const me = this.getMe();
    navigator.geolocation.getCurrentPosition((position) => {
      me[slotKey] = Object.assign(me[slotKey] || {}, {
        location: {
          lat: position.coords.latitude,
          long: position.coords.longitude,
          timestamp: position.timestamp,
        },
      });
      this.updateMyFirebase();
    });
  }

  hideLocation(slotKey: string) {
    delete this.getMe()[slotKey].location;
    this.updateMyFirebase();
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

  getSelectedColor(slotKey: string, schedule: ScheduleType): string {
    const mySelected = this.getMySelected(slotKey);
    const totalSelected = this.getTotalSelected(slotKey);
    if (mySelected > 0) {
      if (totalSelected > mySelected) {
        return schedule.colors?.group || "blue";
      } else {
        return schedule.colors?.solo || "black";
      }
    } else {
      if (totalSelected > 0) {
        return schedule.colors?.others || "red";
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
        location={this.props.readOnly ? undefined : this.location(slotKey)}
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
  modalContents: ReactElement;
  location?: ReactElement;
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
      <div onClick={(e) => e.stopPropagation()}>
        <Modal show={show} onHide={() => update(false)}>
          <Modal.Body>{props.modalContents}</Modal.Body>
          {props.location}
        </Modal>
      </div>
    </>
  );
}

export default BaseGroup;
