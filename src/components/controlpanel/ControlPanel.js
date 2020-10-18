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
          nodeId={getDomain() + 80}
          isCoordinator={true}
          isSubordinate={false}
          subordinates={[`${getDomain()}${85}`, `${getDomain}${90}`]}
          coordinator={""}
        />
        <NodeControl
          nodeId={getDomain() + 85}
          isCoordinator={false}
          isSubordinate={true}
          subordinates={[]}
          coordinator={`${getDomain()}${80}`}
        />
        <NodeControl
          nodeId={getDomain() + 90}
          isCoordinator={false}
          isSubordinate={true}
          subordinates={[]}
          coordinator={`${getDomain()}${80}`}
        />
      </div>
    );
  }
}

export default ControlPanel;
