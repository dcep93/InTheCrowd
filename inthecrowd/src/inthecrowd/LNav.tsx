import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import recorded_sha from "./recorded_sha";

class LNav extends React.Component<{
  logout: () => void;
  userId: string;
}> {
  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href={"/"} title={recorded_sha}>
            InTheCrowd
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={this.help}>Help</Nav.Link>
              <Nav.Link onClick={this.props.logout}>Logout</Nav.Link>
              <Navbar.Brand>{this.props.userId}</Navbar.Brand>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  help() {
    alert("help");
  }
}

export default LNav;
