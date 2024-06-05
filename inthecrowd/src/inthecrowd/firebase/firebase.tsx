import { initializeApp } from "firebase/app"; // no compat for new SDK
import {
  Database,
  get,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import React from "react";

const BASE = "/inthecrowd/tmp";

const project = "firebase-320421";

const config = {
  databaseURL: `https://${project}-default-rtdb.firebaseio.com/`,
};

var database: Database;
type ResultType = { val: () => BlobType | null };
type BlobType = any;

declare global {
  interface Window {
    firebaseinitialized: boolean;
  }
}
window.firebaseinitialized = false;
if (!window.firebaseinitialized) {
  window.firebaseinitialized = true;
  var app = initializeApp(config);
  database = getDatabase(app);
}

function __ref(path: string) {
  return ref(database, `${BASE}/${path}`);
}

function _connect(path: string, callback: (value: BlobType) => void): void {
  onValue(__ref(path), (snapshot: ResultType) => {
    var val = snapshot.val();
    console.log("firebase", Date.now() / 1000, window.location.href, val);
    callback(val);
  });
}

function _get(path: string): BlobType {
  return get(__ref(path));
}

function _set(path: string, obj: BlobType): Promise<void> {
  return set(__ref(path), obj);
}

function _push(path: string, obj: BlobType): Promise<string> {
  return push(__ref(path), obj).then((pushed) => pushed.key!);
}

function _delete(path: string): Promise<void> {
  return remove(__ref(path));
}

abstract class _FirebaseWrapper<T, U = {}> extends React.Component<
  U,
  { state: T }
> {
  static firebaseWrapperComponent: _FirebaseWrapper<any, any>;
  componentDidMount() {
    const oldComponent = _FirebaseWrapper.firebaseWrapperComponent;
    _FirebaseWrapper.firebaseWrapperComponent = this;
    if (oldComponent) {
      this.setState(oldComponent.state);
    } else {
      _connect(this.getFirebasePath(), (state) =>
        _FirebaseWrapper.firebaseWrapperComponent.setState.bind(
          _FirebaseWrapper.firebaseWrapperComponent
        )({ state })
      );
    }
  }

  abstract getFirebasePath(): string;

  render() {
    return <pre>{JSON.stringify(this.state?.state, null, 2)}</pre>;
  }
}

const ex = {
  _connect,
  _get,
  _set,
  _push,
  _delete,
  _FirebaseWrapper,
};

export default ex;
