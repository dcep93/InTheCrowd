import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { warm } from "./CachedImage";
import Group from "./Group";
import NewGroup from "./NewGroup";
import Schedule from "./Schedule";
import Shared from "./Shared";
import Usage from "./Usage";

const STORAGE_KEY = "inthecrowd/0.2.1";

export function mapSort<T>(arr: T[], f: (val: T) => number): T[] {
  return arr
    .map((val) => ({ val, key: f(val) }))
    .sort((a, b) => b.key - a.key)
    .map((o) => o.val);
}

export function randomKey(
  range: number = 100000000,
  disallowed: { [key: string]: any } = {}
) {
  while (true) {
    var rval = Math.floor(Math.random() * range);
    if (disallowed[rval] === undefined) {
      return rval;
    }
  }
}

function Main() {
  warm();
  return (
    <Router>
      <Switch>
        <Route
          exact
          path={`/group/:groupId/user/:userId`}
          render={(props) => (
            <Shared
              groupId={props.match.params.groupId}
              userId={props.match.params.userId}
            />
          )}
        />
        <Route path={`*`} render={() => <LoggedInMain />} />
      </Switch>
    </Router>
  );
}

function LoggedInMain() {
  if (!getUserId()) {
    login();
    return null;
  }

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path={`/`} render={() => <NewGroup />} />
          <Route
            path={`/schedule/:scheduleId`}
            render={(props) => (
              <Schedule scheduleId={props.match.params.scheduleId} />
            )}
          />
          <Route
            path={`/group/:groupId`}
            render={(props) => <Group groupId={props.match.params.groupId} />}
          />
          <Route path={`/usage`} render={() => <Usage />} />
          <Route path={`*`} render={() => "404 not found"} />
        </Switch>
      </div>
    </Router>
  );
}

function login() {
  const userId = prompt("enter your name")?.toLowerCase();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId }));
  window.location.reload();
}

export function logout() {
  localStorage.setItem(STORAGE_KEY, "{}");
  window.location.reload();
}

export function getUserId(): string {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}").userId;
}

export default Main;
