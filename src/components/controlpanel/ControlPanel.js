import React, { Component } from "react";
import NodeControl from "./NodeControl";
import { getDomain } from "../../helpers/getDomain";

class ControlPanel extends Component {
  state = {};
  render() {
    return (
      <div>
        <h1>Control Panel</h1>
        <NodeControl
          nodeId={getDomain() + 1}
          isCoordinator={true}
          isSubordinate={false}
          subordinates={[`${getDomain()}${2}`, `${getDomain}${3}`]}
          coordinator={""}
        />
        <NodeControl
          nodeId={getDomain() + 2}
          isCoordinator={false}
          isSubordinate={true}
          subordinates={[]}
          coordinator={`${getDomain()}${1}`}
        />
        <NodeControl
          nodeId={getDomain() + 3}
          isCoordinator={false}
          isSubordinate={true}
          subordinates={[]}
          coordinator={`${getDomain()}${1}`}
        />
      </div>
    );
  }
}

export default ControlPanel;
