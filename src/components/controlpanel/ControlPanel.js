import React, { Component } from "react";
import NodeControl from "./NodeControl";

class ControlPanel extends Component {
  state = {};
  render() {
    return (
      <div>
        <h1>Control Panel</h1>
        <NodeControl coordinator={true} />
        <NodeControl nodeId={1} coordinator={false} />
        <NodeControl nodeId={2} coordinator={false} />
        <NodeControl nodeId={3} coordinator={false} />
      </div>
    );
  }
}

export default ControlPanel;
