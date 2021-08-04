import React from "react";
import { Nav } from "react-bootstrap";
import BaseRoom from "./BaseRoom";
import LNav from "./LNav";
import { getUserId } from "./Main";

function Room(props: { roomId: string }) {
  const userId = getUserId();
  return (
    <>
      <LNav
        extra={
          <Nav.Link
            onClick={() =>
              (window.location.href = `/room/${props.roomId}/user/${userId}`)
            }
          >
            Share
          </Nav.Link>
        }
      />

      <BaseRoom roomId={props.roomId} userId={userId} />
    </>
  );
}

export default Room;
