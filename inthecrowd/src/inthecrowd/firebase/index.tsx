import { getUserId } from "../Main";
import firebase from "./firebase";

export type MainType = {
  groups?: { [groupId: string]: GroupType };
  lineups?: { [lineupId: string]: LineupType };
};

export type GroupType = {
  id: string;
  name: string;
  creator: string;
  lineup: LineupType;
  users?: { [userId: string]: UserType };
};

export type ColorsType = {
  solo: string;
  group: string;
  others: string;
  clickable: string;
};

export type LineupType = {
  id: string;
  name: string;
  creator: string;
  updated: number;
  days?: DayType[];
  colors?: ColorsType;
};

export type DayType = {
  img: string;
  slots?: { [slotKey: string]: SlotCoordsType };
};

export type SlotCoordsType = {
  x: number;
  y: number;
  width: number;
  height: number;
};

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
  const usage: UsageType = {
    userId: getUserId(),
    path,
    timestamp: new Date().toLocaleString(),
    message,
  };
  firebase._push("/usage", usage);
  return firebase._set(path, obj);
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

function setGroupLineup(groupId: string, lineup: LineupType) {
  setWrapper(`/groups/${groupId}/lineup`, lineup);
}

function setGroupName(groupId: string, name: string) {
  setWrapper(`/groups/${groupId}/name`, name);
}

function createGroup(groupId: string, group: GroupType) {
  setWrapper(`/groups/${groupId}`, group, `create`);
}

function connectLineup(
  lineupId: string,
  setState: (state: LineupType) => void
) {
  firebase._connect(`/lineups/${lineupId}`, (val) => setState(val || {}));
}

function updateLineup(lineupId: string, lineup: LineupType) {
  return setWrapper(
    `/lineups/${lineupId}`,
    Object.assign({}, lineup, { updated: new Date().getTime() })
  );
}

function connectUsage(setState: (usage: { [key: string]: UsageType }) => void) {
  firebase._connect("/usage", (val) => setState(val || {}));
}

const ex = {
  connectGroup,
  updateGroupUser,
  connectMain,
  setGroupLineup,
  setGroupName,
  connectUsage,
  createGroup,
  updateLineup,
  connectLineup,
};

export default ex;
