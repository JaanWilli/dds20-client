import React, { Component } from "react";
import { Button, Label, Icon } from "semantic-ui-react";
import Log from "./logpanel/Log";
import { api, handleError } from "../../helpers/api";

class NodeControl extends Component {
  state = {
    nodeId: this.props.nodeId,
    active: false,
    dieAfter: "prepare",
  };

  async setNodeSettings(active, dieAfter) {
    const requestBody = JSON.stringify({
      active: active,
      dieAfter: dieAfter,
    });

    console.log(active, dieAfter);
    try {
      await api.post("/settings", requestBody);
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
  }

  async getNodeData() {
    //get status
    const response = await api.get("/status");
    this.setState({ active: response.active, dieAfter: response.dieAfter });

    //get log infos
  }

  render() {
    return (
      <div className="nodeControl">
        <h3>Subordinate {this.state.nodeId}</h3>
        <div className="statusSection">
          {this.state.active ? (
            <Label as="a" color="green" tag>
              Active
            </Label>
          ) : (
            <Label as="a" color="red" tag>
              Inactive
            </Label>
          )}
          {this.state.dieAfter ? (
            <Label as="a" color="black" tag>
              die after: {this.state.dieAfter}
            </Label>
          ) : (
            ""
          )}
        </div>
        <div className="buttonSection">
          <Button onClick={() => this.getNodeData()} icon>
            <Icon name="redo alternate"></Icon>
          </Button>
          <Button
            onClick={() => this.setNodeSettings(!this.state.active, null)}
            icon
          >
            <Icon name="power off" />
          </Button>
          <Button>Flag2</Button>
          <Button>Flag3</Button>
        </div>

        <Log />
      </div>
    );
  }
}

export default NodeControl;
