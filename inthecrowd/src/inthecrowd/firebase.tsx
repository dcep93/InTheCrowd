// https://console.firebase.google.com/u/0/project/firebase-320421/database/firebase-320421-default-rtdb/data
// jon is u_4110fc9342fd4

import firebase from "firebase/app";
import "firebase/database";

const config = {
  databaseURL: "https://firebase-320421-default-rtdb.firebaseio.com/",
};

var database: { ref: (path: string) => any };
type ResultType = { val: () => BlobType | null };
type BlobType = any;

const BASE = "/inthecrowd";

var initialized = false;
function init(): void {
  if (initialized) return;
  initialized = true;
  try {
    firebase.initializeApp(config);
  } catch {}
  database = firebase.database();
}

function push(path: string, obj: BlobType): void {
  database.ref(`${BASE}${path}`).push(obj);
}

function connect(path: string, callback: (value: BlobType) => void): void {
  database.ref(`${BASE}/${path}`).on("value", (snapshot: ResultType) => {
    var val = snapshot.val();
    console.log(val);
    callback(val);
  });
}

function set(path: string, obj: BlobType, message: string): void {
  database.ref(`${BASE}/${path}`).set(obj);
  push("/usage", message);
}

const ex = { init, push, connect, set };
export default ex;
