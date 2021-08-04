import React, { ReactElement, useState } from "react";
import { Container, Modal, Nav, Navbar } from "react-bootstrap";
import { getUserId, logout } from "./Main";
import recorded_sha from "./recorded_sha";

function LNav(props: { userId?: string; extra?: ReactElement }) {
  const [show, update] = useState(false);
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href={"/"} title={recorded_sha}>
          InTheCrowd
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => update(true)}>Help</Nav.Link>
            <Modal show={show} onHide={() => update(false)}>
              {help()}
            </Modal>
            <Nav.Link onClick={() => !props.userId && logout()}>
              Logout
            </Nav.Link>
            {props.extra}
            <Navbar.Brand href={"/room"}>
              {props.userId || getUserId()}
            </Navbar.Brand>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function help() {
  return (
    <>
      <Modal.Header>
        <h3>Welcome to InTheCrowd</h3>
      </Modal.Header>
      <Modal.Body>
        <div>
          This is a tool used to coordinate festival shows with friends.
        </div>
        <div>Send questions and feature requests to Daniel.</div>
      </Modal.Body>
      <Modal.Header></Modal.Header>
      <Modal.Header>
        <h3>Choosing a Show</h3>
      </Modal.Header>
      <Modal.Body>
        <div>
          Click the timeslot of a show you're interested in. You can give a show
          0, 1, or 2 votes. In the corner, you can see the number of votes you
          gave a show and the total number of votes a show has.
        </div>
        <div>
          If you click the numbers in the bottom right, you can see the number
          of votes each person gave, and their location with a timestamp. You
          can also provide your GPS location for others to see.
        </div>
        <div>
          The darkness of a show represents the number of votes it has. If a
          show is colored:{" "}
          <ul>
            <li>white = it has no votes</li>
            <li>blue = you gave it votes, along with others</li>
            <li>black = you are the only with votes</li>
            <li>red = only other people gave votes</li>
          </ul>
        </div>
      </Modal.Body>
      <Modal.Header></Modal.Header>
      <Modal.Header>
        <h3>Signing In</h3>
      </Modal.Header>
      <Modal.Body>
        <div>
          This app only uses self-reported local storage to determine your name.
          Enter whatever you want, but if multiple people pick the same name,
          they will collide.
        </div>
      </Modal.Body>
      <Modal.Header></Modal.Header>
      <Modal.Header>
        <h3>Sharing a Room</h3>
      </Modal.Header>
      <Modal.Body>
        <div>
          You can send a link of the room to anyone! They can login and click
          around to see your shows. If you want someone to easily see your
          personal schedule, press the share button and send them that link. You
          can also use screenshot.guru to get a rendered picture of your
          schedule.
        </div>
      </Modal.Body>
      <Modal.Header></Modal.Header>
      <Modal.Header>
        <h3>Creating a Room</h3>
      </Modal.Header>
      <Modal.Body>
        <div>
          On the homepage, you can select an existing schedule and give your
          room a name. Then, send that link to your festival group. You cannot
          disallow people from joining rooms.
        </div>
      </Modal.Body>
      <Modal.Header></Modal.Header>
      <Modal.Header>
        <h3>Creating a Schedule</h3>
      </Modal.Header>
      <Modal.Body>
        <div>
          Hopefully, you'll never have to create a schedule yourself. If you
          need to do so, first you need to define the images of the daily
          schedules. Paste the images in order in the Day Image URL section.
          Then you need to define time slots. Click the desired upper left
          corner, then the lower right corner. Clicking an existing slot will
          delete it. Deleting an image url will delete all its slots and cannot
          be recovered. Creating a room from a schedule will give the room the
          same name as the schedule. If you want a different room name, go back
          to the home page, use the schedule you made, and give your room a
          custom name.
        </div>
      </Modal.Body>
      <Modal.Header></Modal.Header>
      <Modal.Header>
        <h3>Daniel's TODO list</h3>
      </Modal.Header>
      <Modal.Body>
        <ul>
          <li>/room page</li>
          <li>some security</li>
          <li>google login</li>
        </ul>
      </Modal.Body>
    </>
  );
}

export default LNav;
