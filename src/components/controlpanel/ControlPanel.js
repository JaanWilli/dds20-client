import React, { Component } from "react";
import CoordinatorControl from "./CoordinatorControl";
import NodeControl from "./NodeControl";

class ControlPanel extends Component {
  state = {};
  render() {
    return (
      <div>
        <h1>Control Panel</h1>
        <CoordinatorControl />
        <NodeControl nodeId={1} />
        <NodeControl nodeId={2} />
        <NodeControl nodeId={3} />
      </div>
    );
  }
}

export default ControlPanel;
