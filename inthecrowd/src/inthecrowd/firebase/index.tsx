import { getUserId } from "../Main";
import firebase from "./firebase";

export type MainType = {
  groups?: { [groupId: string]: GroupType };
  schedules?: { [scheduleId: string]: ScheduleType };
};

export type GroupType = {
  id: string;
  name: string;
  creator: string;
  schedule: ScheduleType;
  users?: { [userId: string]: UserType };
};

export type ScheduleType = {
  id: string;
  name: string;
  creator: string;
  updated: number;
  days?: DayType[];
  colors?: { solo: string; group: string; others: string; clickable: string };
};

export type DayType = {
  img: string;
  slots?: { [slotKey: string]: SlotCoordsType };
};

export type SlotCoordsType = { x1: number; y1: number; x2: number; y2: number };

export type UserType = {
  [slotKey: string]: UserSlotType;
};

export type UserSlotType = {
  selected: number;
  location?: { lat?: string; long?: string; timestamp: number };
};

export type UsageType = {
  userId: string;
  path: string;
  timestamp: string;
  message: string;
};

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

function connectGroup(groupId: string, setState: (group: GroupType) => void) {
  firebase._connect(`/groups/${groupId}`, (val) => setState(val || {}));
}

function updateGroupUser(groupId: string, userId: string, user: UserType) {
  setWrapper(`/groups/${groupId}/users/${userId}`, user);
}

function connectMain(setState: (main: MainType) => void) {
  firebase._connect("/", (val) => setState(val || {}));
}

function setGroupSchedule(groupId: string, schedule: ScheduleType) {
  setWrapper(`/groups/${groupId}/schedule`, schedule);
}

function setGroupName(groupId: string, name: string) {
  setWrapper(`/groups/${groupId}/name`, name);
}

function createGroup(groupId: string, group: GroupType) {
  setWrapper(`/groups/${groupId}`, group, `create`);
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
  connectGroup,
  updateGroupUser,
  connectMain,
  setGroupSchedule,
  setGroupName,
  connectUsage,
  createGroup,
  updateSchedule,
  connectSchedule,
};

export default ex;
