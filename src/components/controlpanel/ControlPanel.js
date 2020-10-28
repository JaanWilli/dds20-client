import React, { Component } from "react";
import NodeControl from "./NodeControl";
import { Button } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

class ControlPanel extends Component {
  state = {};

  back() {
    this.props.history.push(`/settings`);
  }

  render() {
    const nodes = JSON.parse(localStorage.getItem("nodes"));

    return (
      <div>
        <div>
          <Button onClick={() => this.back()}>Settings</Button>
        </div>
        <div>
          {nodes.map((node) => {
            return (
              <NodeControl
                nodeId={node.nodeId}
                isCoordinator={node.isCoordinator}
                isSubordinate={node.isSubordinate}
                subordinates={node.subordinates}
                coordinator={node.coordinator}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default withRouter(ControlPanel);
