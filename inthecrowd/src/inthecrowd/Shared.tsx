import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Nav } from "react-bootstrap";
import LNav from "./LNav";
import Room from "./Room";

export function randomKey() {
  return Math.floor(Math.random() * 100000000);
}

function Shared(props: { userId: string; roomId: string }) {
  return (
    <>
      <LNav
        userId={props.userId}
        extra={
          <>
            <Nav.Link
              onClick={() => (window.location.href = `/room/${props.roomId}`)}
            >
              Room
            </Nav.Link>
            <Nav.Link
              onClick={() => window.open("https://screenshot.guru", "_blank")}
            >
              Screenshot
            </Nav.Link>
          </>
        }
      />
      <Room roomId={props.roomId} userId={props.userId} readOnly={true} />
    </>
  );
}

export default Shared;
