import React from "react";
import firebase, { UsageType } from "./firebase";
import css from "./index.module.css";
import LNav from "./LNav";

class Usage extends React.Component<{}, { [key: string]: UsageType }> {
  componentDidMount() {
    firebase.connectUsage(this.setState.bind(this));
  }

  render() {
    if (!this.state) return null;
    document.title = "Usage";
    return (
      <>
        <LNav />
        <div className={[css.bubble, css.courier].join(" ")}>
          {Object.values(this.state)
            .reverse()
            .map((s, i) => (
              <div key={i}>
                {i} {JSON.stringify(s)}
              </div>
            ))}
        </div>
      </>
    );
  }
}

export default Usage;
