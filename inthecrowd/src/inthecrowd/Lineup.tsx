import React, { RefObject } from "react";
import { Button } from "react-bootstrap";
import Days from "./Days";
import LNav from "./LNav";
import { getUserId, randomKey } from "./Main";
import { createGroup } from "./NewGroup";
import firebase, { LineupType } from "./firebase";
import css from "./index.module.css";

export default class Lineup extends React.Component<
  { lineupId: string },
  LineupType
> {
  componentDidMount() {
    firebase.connectLineup(this.props.lineupId, this.setState.bind(this));
  }

  updateFirebase() {
    firebase.updateLineup(
      this.props.lineupId,
      Object.assign({}, this.state, {
        id: this.props.lineupId,
        creator: getUserId(),
      })
    );
  }

  inputRef: RefObject<HTMLInputElement> = React.createRef();
  render() {
    if (!this.state) return "loading...";
    document.title = this.state.name || "lineup";
    return (
      <>
        <LNav />
        <div>
          <div className={css.flex}>
            <div className={css.bubble}>
              <h3>Lineup</h3>
              <TextEditor
                defaultValue={this.state.name || "lineup"}
                submit={(name) => {
                  Object.assign(this.state as LineupType, { name });
                  this.updateFirebase();
                  return false;
                }}
              />
              <div>#{this.props.lineupId}</div>
              <Button
                onClick={() =>
                  createGroup(this.state.name || "group", this.state)
                }
              >
                Create Group
              </Button>
            </div>
            <div className={css.bubble}>
              <h3>Colors</h3>
              <div className={css.courier}>
                <div>
                  <label>solo</label>
                  {"      "}
                  <TextEditor
                    defaultValue={this.state.colors?.solo || "black"}
                    submit={(solo) => {
                      Object.assign(this.state as LineupType, {
                        colors: Object.assign(this.state.colors || {}, {
                          solo,
                        }),
                      });
                      this.updateFirebase();
                      return false;
                    }}
                  />
                </div>
                <div>
                  <label>group</label>
                  {"     "}
                  <TextEditor
                    defaultValue={this.state.colors?.group || "blue"}
                    submit={(group) => {
                      Object.assign(this.state as LineupType, {
                        colors: Object.assign(this.state.colors || {}, {
                          group,
                        }),
                      });
                      this.updateFirebase();
                      return false;
                    }}
                  />
                </div>
                <div>
                  <label>others</label>
                  {"    "}
                  <TextEditor
                    defaultValue={this.state.colors?.others || "red"}
                    submit={(others) => {
                      Object.assign(this.state as LineupType, {
                        colors: Object.assign(this.state.colors || {}, {
                          others,
                        }),
                      });
                      this.updateFirebase();
                      return false;
                    }}
                  />
                </div>
                <div>
                  <label>clickable</label>{" "}
                  <TextEditor
                    defaultValue={this.state.colors?.clickable || "blue"}
                    submit={(clickable) => {
                      Object.assign(this.state as LineupType, {
                        colors: Object.assign(this.state.colors || {}, {
                          clickable,
                        }),
                      });
                      this.updateFirebase();
                      return false;
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={css.bubble}>
              <h3>Day Image URLs</h3>
              {(this.state.days || []).map((day, i) => (
                <div key={i} className={css.courier}>
                  {i + 1}{" "}
                  <TextEditor
                    defaultValue={day.img}
                    submit={(update) => {
                      if (!update) {
                        (this.state.days || []).splice(i, 1);
                      } else {
                        day.img = update;
                      }
                      this.updateFirebase();
                      return !update;
                    }}
                  />
                </div>
              ))}
              <TextEditor
                defaultValue={""}
                submit={(img) => {
                  if (!img) return true;
                  if (!this.state.days)
                    Object.assign(this.state as LineupType, { days: [] });
                  this.state.days!.push({ img, slots: {} });
                  this.updateFirebase();
                  return true;
                }}
              />
            </div>
          </div>
          <Days
            userId={getUserId()}
            days={this.state.days || []}
            dayProps={{
              imgClick: this.imgClick.bind(this),
              slotClick: this.slotClick.bind(this),
              getOpacity: () => 0.4,
              getSelectedColor: () => "gold",
              getContents: () => "*",
            }}
          />
        </div>
      </>
    );
  }

  badState?: { dayIndex: number; slotCorner: { x: number; y: number } };
  imgClick(dayIndex: number, e: React.MouseEvent) {
    const slotCorner = { x: e.pageX, y: e.pageY };
    const target = e.target as HTMLImageElement;
    slotCorner.y -= (target.offsetParent! as HTMLElement).offsetTop;
    slotCorner.x /= target.width / 100;
    slotCorner.y /= target.height / 100;
    if (dayIndex !== this.badState?.dayIndex) {
      this.badState = { dayIndex, slotCorner };
      return;
    }
    const day = this.state.days![dayIndex];
    if (!day.slots) day.slots = {};
    const slot = {
      x1: this.badState.slotCorner.x,
      y1: this.badState.slotCorner.y,
      x2: slotCorner.x,
      y2: slotCorner.y,
    };
    day.slots[randomKey()] = slot;
    this.badState = undefined;
    this.updateFirebase();
  }

  slotClick(dayIndex: number, slotKey: string) {
    const day = this.state.days![dayIndex];
    const slots = day.slots;
    delete slots![slotKey];
    this.updateFirebase();
  }
}

type PropsType = {
  defaultValue: string;
  submit: (update: string) => boolean;
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
          if (this.props.submit(this.inputRef.current!.value)) {
            this.inputRef.current!.value = "";
          }
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
