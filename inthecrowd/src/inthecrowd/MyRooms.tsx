import React from "react";
import firebase from "./firebase";
import css from "./index.module.css";
import LNav from "./LNav";

class MyRooms extends React.Component<{ userId: string }, any> {
  componentDidMount() {
    firebase.init();
    firebase.connect(this.getFirebasePath(), (val) => this.setState(val || {}));
  }

  getFirebasePath() {
    return `/`;
  }

  render() {
    if (!this.state) return null;
    document.title = "MyRooms";
    return (
      <>
        <LNav />
        <div className={[css.bubble, css.courier].join(" ")}>
          {JSON.stringify(this.state)}
        </div>
      </>
    );
  }
}

export default MyRooms;
