import React, { Component } from "react";
import { Button, Label, Icon } from "semantic-ui-react";
import Log from "./logpanel/Log";
import { api, handleError } from "../../helpers/api";

class NodeControl extends Component {
  state = {
    nodeId: this.props.nodeId,
    coordinator: this.props.coordinator,
    active: false,
    dieAfter: "never",
    logitems: [
      {
        id: 5,
        message: "prepare",
        node: 4,
        transId: 4,
        coordId: 5,
        subordinate: ["123.456.788", "123.456.788"],
        isStatus: false,
      },
      {
        id: 5,
        message: "The node is doing cool things",
        node: null,
        transId: null,
        coordId: null,
        subordinate: null,
        isStatus: true,
      },
    ],
  };

  async startTransaction() {
    console.log("API POST /start");
    try {
      await api.post("/start");
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
  }

  async setNodeSettings(active, dieAfter) {
    const requestBody = JSON.stringify({
      active: active,
      dieAfter: dieAfter,
    });

    console.log("API POST /settings", requestBody);
    try {
      await api.post("/settings", requestBody);
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
    this.getNodeData();
  }

  async getNodeData() {
    //get status
    console.log("API GET /status");
    try {
      const statusResponse = await api.get("/status");
      console.log("Response: ", statusResponse);
      console.log(statusResponse.data.active);
      this.setState({
        active: statusResponse.data.active,
        dieAfter: statusResponse.data.dieAfter,
      });
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }

    //get log infos
    console.log("API GET /info");
    try {
      const logResponse = await api.get("/info");
      console.log("Response: ", logResponse);
      this.setState({ logitems: logResponse.data.logs });
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
  }

  render() {
    return (
      <div className="nodeControl">
        {this.state.coordinator ? (
          <h3>Coordinator</h3>
        ) : (
          <h3>Subordinate {this.state.nodeId}</h3>
        )}
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
          {this.state.dieAfter !== "never" ? (
            <Label as="a" color="black" tag>
              die after: {this.state.dieAfter}
            </Label>
          ) : (
            ""
          )}
        </div>
        <div className="buttonSection">
          <Button
            onClick={() => this.setNodeSettings(!this.state.active, "never")}
            icon
          >
            <Icon name="power off" />
          </Button>
          <Button onClick={() => this.getNodeData()} icon>
            <Icon name="redo alternate"></Icon>
          </Button>
          {this.state.coordinator ? (
            <div className="coordinatorSpecific">
              <Button
                onClick={() => this.startTransaction()}
                disabled={!this.state.active}
                icon
              >
                <Icon name="play"></Icon>
              </Button>
              <Button
                onClick={() =>
                  this.setNodeSettings(this.state.active, "prepare")
                }
                disabled={!this.state.active}
              >
                Die after sending prepare
              </Button>
              <Button
                onClick={() =>
                  this.setNodeSettings(this.state.active, "commit/abort")
                }
                disabled={!this.state.active}
              >
                Die after sending commit/abort
              </Button>
            </div>
          ) : (
            <div className="subordinateSpecific">
              <Button
                onClick={() =>
                  this.setNodeSettings(this.state.active, "yes/no")
                }
                disabled={!this.state.active}
              >
                Die after sending yes/no
              </Button>
              <Button disabled={!this.state.active}>Flag3</Button>
            </div>
          )}
        </div>

        <Log logitems={this.state.logitems} />
      </div>
    );
  }
}

export default NodeControl;
