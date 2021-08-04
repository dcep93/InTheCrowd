import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Nav } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Lineup from "./Lineup";
import LNav from "./LNav";
import LoggedInMain from "./LoggedInMain";

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
            <>
              <LNav
                userId={props.match.params.userId}
                logout={() => null}
                extra={
                  <Nav.Link
                    onClick={() =>
                      window.open("https://screenshot.guru", "_blank")
                    }
                  >
                    Screenshot
                  </Nav.Link>
                }
              />
              <Lineup
                roomId={props.match.params.roomId}
                userId={props.match.params.userId}
                readOnly={true}
              />
            </>
          )}
        />
        <Route path={`*`} render={() => <LoggedInMain />} />
      </Switch>
    </Router>
  );
}

export default Main;
