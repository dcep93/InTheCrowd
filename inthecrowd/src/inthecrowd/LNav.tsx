import React, { ReactElement } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { logout } from "./LoggedInMain";
import recorded_sha from "./recorded_sha";

function LNav(props: { userId: string; extra?: ReactElement }) {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href={"/"} title={recorded_sha}>
          InTheCrowd
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={help}>Help</Nav.Link>
            <Nav.Link onClick={logout}>Logout</Nav.Link>
            {props.extra}
            <Navbar.Brand>{props.userId}</Navbar.Brand>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function help() {
  alert("help");
}

export default LNav;
