import React from "react";
import { Nav } from "react-bootstrap";
import BaseRoom from "./BaseRoom";
import LNav from "./LNav";
import { logout } from "./Main";

function Room(props: { userId: string; roomId: string }) {
  return (
    <>
      <LNav
        userId={props.userId}
        logout={logout}
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
