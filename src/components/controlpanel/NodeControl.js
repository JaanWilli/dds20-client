import React, { Component } from "react";
import { Button, Label, Icon } from "semantic-ui-react";
import Log from "./logpanel/Log";
import { apiPost, apiGet, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";

class NodeControl extends Component {
  state = {
    nodeId: this.props.nodeId,
    isCoordinator: this.props.isCoordinator,
    isSubordinate: this.props.isSubordinate,
    subordinates: this.props.subordinates,
    coordinator: this.props.coordinator,

    active: false,
    dieAfter: "never",
    vote: true,
    logitems: [],
  };

  componentDidMount() {
    this.setup();
    this.intervalId = setInterval(() => {
      this.getNodeData();
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  back() {
    this.props.history.push(`/settings`);
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
      this.setNodeSettings(true, this.state.dieAfter, this.state.vote);
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
      this.back();
    }
  }

  async startTransaction() {
    console.log("API POST /start");
    try {
      await apiPost(this.state.nodeId, "/start");
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
      this.back();
    }
  }

  async setNodeSettings(active, dieAfter, vote) {
    const requestBody = JSON.stringify({
      active: active,
      dieAfter: dieAfter,
      vote: vote,
    });

    console.log("API POST /settings", requestBody);
    try {
      await apiPost(this.state.nodeId, "/settings", requestBody);
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
      this.back();
    }
    this.getNodeData();
  }

  async getNodeData() {
    //get status
    console.log("API GET /status");
    try {
      const statusResponse = await apiGet(this.state.nodeId, "/status");
      console.log("Response: ", statusResponse);
      this.setState({
        active: statusResponse.data.active,
        dieAfter: statusResponse.data.dieAfter,
        vote: statusResponse.data.vote,
      });
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
      this.back();
    }

    //get log infos
    console.log("API GET /info");
    try {
      const logResponse = await apiGet(this.state.nodeId, "/info");
      console.log("Response: ", logResponse);
      this.setState({ logitems: logResponse.data });
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
      this.back();
    }
  }

  handleDieAfter(newState) {
    this.setNodeSettings(this.state.active, newState, this.state.vote);
  }

  handleVote(newVote) {
    this.setNodeSettings(this.state.active, this.state.dieAfter, newVote);
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
          {this.state.isSubordinate ? (
            this.state.vote ? (
              <Label
                onClick={() => this.handleVote(!this.state.vote)}
                as="a"
                color="green"
                tag
              >
                Yes-Vote
              </Label>
            ) : (
              <Label
                onClick={() => this.handleVote(!this.state.vote)}
                as="a"
                color="red"
                tag
              >
                No-Vote
              </Label>
            )
          ) : (
            ""
          )}

          {this.state.dieAfter && this.state.dieAfter !== "never" ? (
            <Label as="a" color="black" tag>
              die after: {this.state.dieAfter}
            </Label>
          ) : (
            ""
          )}
        </div>
        <div className="buttonSection">
          {this.state.isCoordinator ? (
            <Button
              onClick={() => this.startTransaction()}
              disabled={!this.state.active}
              icon
            >
              <Icon name="play"></Icon>
            </Button>
          ) : (
            <Button onClick={() => this.handleVote(!this.state.vote)}>
              Change Vote
            </Button>
          )}
          {this.state.isCoordinator ? (
            <div className="coordinatorSpecific">
              <Label>Die After:</Label>
              <Button.Group>
                <Button
                  onClick={() => {
                    this.state.dieAfter !== "prepare"
                      ? this.handleDieAfter("prepare")
                      : this.handleDieAfter("never");
                  }}
                  disabled={!this.state.active}
                >
                  Sending Prepare
                </Button>
                <Button
                  onClick={() => {
                    this.state.dieAfter !== "commit/abort"
                      ? this.handleDieAfter("commit/abort")
                      : this.handleDieAfter("never");
                  }}
                  disabled={!this.state.active}
                >
                  Writing Commit/Abort
                </Button>
                <Button
                  onClick={() => {
                    this.state.dieAfter !== "result"
                      ? this.handleDieAfter("result")
                      : this.handleDieAfter("never");
                  }}
                  disabled={!this.state.active}
                >
                  Sending Commit/Abort
                </Button>
              </Button.Group>
            </div>
          ) : (
            <div className="subordinateSpecific">
              <Label>Die After:</Label>
              <Button.Group>
                <Button
                  onClick={() => {
                    this.state.dieAfter !== "prepare"
                      ? this.handleDieAfter("prepare")
                      : this.handleDieAfter("never");
                  }}
                  disabled={!this.state.active}
                >
                  Writing {this.state.vote ? "Prepare" : "Abort"}
                </Button>
                <Button
                  onClick={() => {
                    this.state.dieAfter !== "vote"
                      ? this.handleDieAfter("vote")
                      : this.handleDieAfter("never");
                  }}
                  disabled={!this.state.active}
                >
                  Sending Vote
                </Button>
                {this.state.vote ? (
                  <Button
                    onClick={() => {
                      this.state.dieAfter !== "commit/abort"
                        ? this.handleDieAfter("commit/abort")
                        : this.handleDieAfter("never");
                    }}
                    disabled={!this.state.active}
                  >
                    Writing Commit/Abort
                  </Button>
                ) : (
                  ""
                )}
              </Button.Group>
            </div>
          )}
        </div>

        <Log logitems={this.state.logitems} />
      </div>
    );
  }
}

export default withRouter(NodeControl);
