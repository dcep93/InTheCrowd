import React from "react";
import { Nav } from "react-bootstrap";
import BaseRoom from "./BaseRoom";
import LNav from "./LNav";

function Room(props: { userId: string; roomId: string }) {
  return (
    <>
      <LNav
        extra={
          <Nav.Link
            onClick={() =>
              (window.location.href = `/room/${props.roomId}/user/${props.userId}`)
            }
          >
            Share
          </Nav.Link>
        }
      />

      <BaseRoom roomId={props.roomId} userId={props.userId} />
    </>
  );
}

export default Room;
