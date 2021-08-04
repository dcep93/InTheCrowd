import React from "react";
import firebase from "./firebase";
import css from "./index.module.css";

class Usage extends React.Component {
  componentDidMount() {
    document.title = "Usage";
    firebase.init();
    firebase.connect(this.getFirebasePath(), (val) => this.setState(val || {}));
  }

  getFirebasePath() {
    return `/usage`;
  }

  render() {
    if (!this.state) return null;
    return (
      <div className={[css.bubble, css.courier].join(" ")}>
        {Object.values(this.state)
          .reverse()
          .map((s, i) => (
            <div key={i}>
              {i} {s as string}
            </div>
          ))}
      </div>
    );
  }
}

export default Usage;
