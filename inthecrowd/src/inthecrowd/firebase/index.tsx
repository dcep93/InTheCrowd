import { getUserId } from "../Main";
import firebase from "./firebase";

// todo optional types
export type SlotCoordsType = { x1: number; y1: number; x2: number; y2: number };

export type DayType = {
  img: string;
  width: string;
  slots?: { [slotKey: string]: SlotCoordsType };
};

export type UserType = {
  [slotKey: string]: UserSlotType;
};

export type UserSlotType = {
  selected: number;
  location?: { lat: string; long: string; timestamp: number };
};

export type RoomType = {
  id: string;
  name: string;
  creator: string;
  schedule: ScheduleType;
  users?: { [userId: string]: UserType };
  days?: DayType[];
};

export type ScheduleType = {
  id: string;
  name: string;
  creator: string;
  updated: number;
  days?: DayType[];
  colors?: { solo: string; group: string; others: string };
};

export type UsageType = {
  userId: string;
  path: string;
  timestamp: string;
  message: string;
};

export type MainType = {
  rooms?: { [roomId: string]: RoomType };
  schedules?: { [scheduleId: string]: ScheduleType };
};

declare global {
  interface Window {
    firebaseinitialized: boolean;
  }
}
window.firebaseinitialized = false;
if (!window.firebaseinitialized) {
  window.firebaseinitialized = true;
  firebase._init();
}

function setWrapper(path: string, obj: any, message: string = "") {
  firebase._set(path, obj);
  const usage: UsageType = {
    userId: getUserId(),
    path,
    timestamp: new Date().toLocaleString(),
    message,
  };
  firebase._push("/usage", usage);
}

function connectRoom(roomId: string, setState: (room: RoomType) => void) {
  firebase._connect(`/rooms/${roomId}`, (val) => setState(val || {}));
}

function updateRoomUser(roomId: string, userId: string, user: UserType) {
  setWrapper(`/rooms/${roomId}/users/${userId}`, user);
}

function connectMain(setState: (main: MainType) => void) {
  firebase._connect("/", (val) => setState(val || {}));
}

function setRoomSchedule(roomId: string, schedule: ScheduleType) {
  setWrapper(`/rooms/${roomId}/schedule`, schedule);
}

function setRoomName(roomId: string, name: string) {
  setWrapper(`/rooms/${roomId}/name`, name);
}

function createRoom(roomId: string, room: RoomType) {
  setWrapper(`/rooms/${roomId}`, room, `create`);
}

function connectSchedule(
  scheduleId: string,
  setState: (state: ScheduleType) => void
) {
  firebase._connect(`/schedules/${scheduleId}`, (val) => setState(val || {}));
}

function updateSchedule(scheduleId: string, schedule: ScheduleType) {
  setWrapper(
    `/schedules/${scheduleId}`,
    Object.assign({}, schedule, { updated: new Date().getTime() })
  );
}

function connectUsage(setState: (usage: { [key: string]: UsageType }) => void) {
  firebase._connect("/usage", (val) => setState(val || {}));
}

const ex = {
  connectRoom,
  updateRoomUser,
  connectMain,
  setRoomSchedule,
  setRoomName,
  connectUsage,
  createRoom,
  updateSchedule,
  connectSchedule,
};

export default ex;
