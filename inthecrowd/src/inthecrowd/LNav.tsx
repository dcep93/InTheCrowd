import React, { ReactElement, useState } from "react";
import { Container, Modal, Nav, Navbar } from "react-bootstrap";
import recorded_sha from "./recorded_sha";

function LNav(props: {
  userId: string;
  logout: () => void;
  extra?: ReactElement;
}) {
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
              <Modal.Body>help</Modal.Body>
            </Modal>
            <Nav.Link onClick={props.logout}>Logout</Nav.Link>
            {props.extra}
            <Navbar.Brand>{props.userId}</Navbar.Brand>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default LNav;
