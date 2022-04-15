// https://console.firebase.google.com/u/0/project/firebase-320421/database/firebase-320421-default-rtdb/data
// https://console.cloud.google.com/storage/browser/inthecrowd;tab=objects?forceOnBucketsSortingFiltering=false&project=firegame-320422&prefix=&forceOnObjectsSortingFiltering=false

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
function _init(): void {
  if (initialized) return;
  initialized = true;
  try {
    firebase.initializeApp(config);
  } catch {}
  database = firebase.database();
}

function _push(path: string, obj: BlobType): void {
  database.ref(`${BASE}${path}`).push(obj);
}

function _connect(path: string, callback: (value: BlobType) => void): void {
  database.ref(`${BASE}/${path}`).on("value", (snapshot: ResultType) => {
    var val = snapshot.val();
    console.log(val);
    callback(val);
  });
}

function _set(path: string, obj: BlobType, message: string = ""): void {
  console.log(path, obj, message);
  database.ref(`${BASE}/${path}`).set(obj);
}

const ex = { _init, _push, _connect, _set };
export default ex;
