import React from "react";
import { Nav } from "react-bootstrap";
import BaseGroup from "./BaseGroup";
import LNav from "./LNav";
import { getUserId } from "./Main";

function Group(props: { groupId: string }) {
  const userId = getUserId();
  return (
    <>
      <LNav
        extra={
          <Nav.Link
            onClick={() =>
              (window.location.href = `/group/${props.groupId}/user/${userId}`)
            }
          >
            Share
          </Nav.Link>
        }
      />

      <BaseGroup groupId={props.groupId} userId={userId} />
    </>
  );
}

export default Group;
