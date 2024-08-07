import React, { RefObject } from "react";
import { Button } from "react-bootstrap";
import { getColors } from "./BaseGroup";
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
    firebase.connectLineup(this.props.lineupId, (lineup) =>
      this.setState(lineup)
    );
  }

  updateFirebase() {
    return firebase.updateLineup(
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
                  Promise.resolve()
                    .then(() =>
                      this.state.id !== undefined ? null : this.updateFirebase()
                    )
                    .then(() =>
                      createGroup(
                        randomKey({}).toString(),
                        this.state.name || "group",
                        this.state
                      )
                    )
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
                    defaultValue={getColors(this.state).solo}
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
                    defaultValue={getColors(this.state).group}
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
                    defaultValue={getColors(this.state).others}
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
                    defaultValue={getColors(this.state).clickable}
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
              getSelectedColor: () => getColors(this.state).solo,
              getContents: () => "*",
            }}
          />
        </div>
      </>
    );
  }

  imgClick(prev: ImgClickType, dayIndex: number, e: React.MouseEvent) {
    const slotCorner = { x: e.pageX, y: e.pageY };
    const target = e.target as HTMLImageElement;
    slotCorner.y -= (target.offsetParent! as HTMLElement).offsetTop;
    slotCorner.x /= target.width / 100;
    slotCorner.y /= target.height / 100;
    if (dayIndex !== prev?.dayIndex) {
      return { dayIndex, slotCorner };
    }
    const day = this.state.days![dayIndex];
    if (!day.slots) day.slots = {};
    const width = slotCorner.x - prev.slotCorner.x;
    const height = slotCorner.y - prev.slotCorner.y;
    if (width < 2 || height < 2) return prev;
    day.slots[randomKey(day.slots)] = {
      ...prev.slotCorner,
      width,
      height,
    };
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

type ImgClickType =
  | undefined
  | { dayIndex: number; slotCorner: { x: number; y: number } };
