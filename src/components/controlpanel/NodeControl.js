import React, { Component } from "react";
import { Button, Label, Icon } from "semantic-ui-react";
import Log from "./logpanel/Log";
import { apiPost, apiGet, handleError } from "../../helpers/api";

class NodeControl extends Component {
  state = {
    nodeId: this.props.nodeId,
    isCoordinator: this.props.isCoordinator,
    isSubordinate: this.props.isSubordinate,
    subordinates: this.props.subordinates,
    coordinator: this.props.coordinator,

    active: false,
    dieAfter: "never",
    logitems: [],
  };

  componentDidMount() {
    this.setup();
    this.getNodeData();
  }

  async setup() {
    const requestBody = JSON.stringify({
      node: this.state.nodeId,
      isCoordinator: this.state.isCoordinator,
      isSubordinate: this.state.isSubordinate,
      subordinates: this.state.subordinates,
      coordinator: this.state.coordinator,
    });

    console.log("API POST /setup", requestBody);
    try {
      await apiPost(this.state.nodeId, "/setup", requestBody);
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
  }

  async startTransaction() {
    console.log("API POST /start");
    try {
      await apiPost(this.state.nodeId, "/start");
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
      await apiPost(this.state.nodeId, "/settings", requestBody);
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
    this.getNodeData();
  }

  async getNodeData() {
    //get status
    console.log("API GET /status");
    try {
      const statusResponse = await apiGet(this.state.nodeId, "/status");
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
      const logResponse = await apiGet(this.state.nodeId, "/info");
      console.log("Response: ", logResponse);
      this.setState({ logitems: logResponse.data });
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
  }

  render() {
    return (
      <div className="nodeControl">
        {this.state.isCoordinator ? (
          <h3>Coordinator ({this.state.nodeId})</h3>
        ) : (
          <h3>Subordinate ({this.state.nodeId})</h3>
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
          {this.state.isCoordinator ? (
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
