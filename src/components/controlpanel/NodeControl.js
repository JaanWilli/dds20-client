import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import Log from "./logpanel/Log";

class NodeControl extends Component {
  state = {};
  render() {
    return (
      <div className="nodeControl">
        <h3>Subordinate {this.props.nodeId}</h3>
        <div className="buttonSection">
          <Button>Flag1</Button>
          <Button>Flag2</Button>
          <Button>Flag3</Button>
        </div>

        <Log />
      </div>
    );
  }
}

export default NodeControl;
