import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MyRooms from "./MyRooms";
import NewRoom from "./NewRoom";
import Room from "./Room";
import Schedule from "./Schedule";
import Shared from "./Shared";
import Usage from "./Usage";

const STORAGE_KEY = "inthecrowd/0.2.1";

export function randomKey(range: number = 100000000) {
  return Math.floor(Math.random() * range);
}

function Main() {
  return (
    <Router>
      <Switch>
        <Route
          exact
          path={`/room/:roomId/user/:userId`}
          render={(props) => (
            <Shared
              roomId={props.match.params.roomId}
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
          <Route exact path={`/`} render={() => <NewRoom />} />
          <Route
            path={`/schedule/:scheduleId`}
            render={(props) => (
              <Schedule scheduleId={props.match.params.scheduleId} />
            )}
          />
          <Route
            path={`/room/:roomId`}
            render={(props) => <Room roomId={props.match.params.roomId} />}
          />
          <Route path={`/room`} render={() => <MyRooms />} />
          <Route path={`/usage`} render={() => <Usage />} />
          <Route path={`*`} render={() => "404 not found"} />
        </Switch>
      </div>
    </Router>
  );
}

function login() {
  const userId = prompt("enter your name");
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
