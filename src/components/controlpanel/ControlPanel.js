import React, { Component } from "react";
import NodeControl from "./NodeControl";

class ControlPanel extends Component {
  state = {};
  render() {
    return (
      <div>
        <h1>Control Panel</h1>
        <NodeControl nodeId={80} coordinator={true} />
        <NodeControl nodeId={85} coordinator={false} />
        <NodeControl nodeId={90} coordinator={false} />
      </div>
    );
  }
}

export default ControlPanel;
