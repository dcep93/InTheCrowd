import React from "react";
import { Nav } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Lineup from "./Lineup";
import LNav from "./LNav";
import NewRoom from "./NewRoom";
import Schedule from "./Schedule";
import Usage from "./Usage";

const STORAGE_KEY = "inthecrowd/0.2.1";

export function randomKey() {
  return Math.floor(Math.random() * 100000000);
}

function LoggedInMain() {
  const userId = getUserId();
  if (!userId) {
    login();
    return null;
  }

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path={`/`} render={() => <NewRoom userId={userId} />} />
          <Route
            path={`/schedule/:scheduleId`}
            render={(props) => (
              <Schedule
                scheduleId={props.match.params.scheduleId}
                userId={userId}
              />
            )}
          />
          <Route path={`/usage`} render={() => <Usage />} />
          <Route
            path={`/room/:roomId`}
            render={(props) => (
              <>
                <LNav
                  userId={userId}
                  extra={
                    <Nav.Link
                      onClick={() =>
                        (window.location.href = `/room/${props.match.params.roomId}/user/${userId}`)
                      }
                    >
                      Share
                    </Nav.Link>
                  }
                />

                <Lineup roomId={props.match.params.roomId} userId={userId} />
              </>
            )}
          />
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

export default LoggedInMain;
