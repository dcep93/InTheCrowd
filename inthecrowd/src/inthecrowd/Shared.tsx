import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Nav } from "react-bootstrap";
import BaseGroup from "./BaseGroup";
import LNav from "./LNav";

function Shared(props: { userId: string; groupId: string }) {
  return (
    <>
      <LNav
        userId={props.userId}
        extra={
          <>
            <Nav.Link
              onClick={() => (window.location.href = `/group/${props.groupId}`)}
            >
              Group
            </Nav.Link>
            <Nav.Link
              onClick={() => window.open("https://screenshot.guru", "_blank")}
            >
              Screenshot
            </Nav.Link>
          </>
        }
      />
      <BaseGroup
        groupId={props.groupId}
        userId={props.userId}
        readOnly={true}
      />
    </>
  );
}

export default Shared;
