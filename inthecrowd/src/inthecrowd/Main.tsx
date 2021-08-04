import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoggedInMain from "./LoggedInMain";
import Shared from "./Shared";

export function randomKey() {
  return Math.floor(Math.random() * 100000000);
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

export default Main;
