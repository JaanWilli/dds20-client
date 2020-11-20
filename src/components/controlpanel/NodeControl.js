import React, { Component } from "react";
import { Button, Label } from "semantic-ui-react";
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
      localStorage.getItem("random")
        ? this.setRandomNodeSettings()
        : this.setNodeSettings(true, this.state.dieAfter, this.state.vote);
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
      this.back();
    }
  }

  async startTransaction() {
    if (this.state.active) {
      console.log("API POST /start");
      try {
        await apiPost(this.state.nodeId, "/start");
      } catch (error) {
        alert(`Something went wrong: \n${handleError(error)}`);
        this.back();
      }
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

  async setRandomNodeSettings() {
    let rand1 = Math.floor(Math.random() * 100);
    let rand2 = Math.floor(Math.random() * 100);

    const votes = [true, false];
    const dieAfterCoordinator = ["never", "prepare", "commit/abort", "result"];
    const dieAfterSubordinateYes = ["never", "prepare", "vote", "commit/abort"];
    const dieAfterSubordinateNo = ["never", "prepare", "vote"];

    let vote;
    let dieAfters;
    if (this.state.isCoordinator) {
      vote = true;
      dieAfters = dieAfterCoordinator;
    } else {
      vote = votes[rand1 % 2];
      dieAfters = vote ? dieAfterSubordinateYes : dieAfterSubordinateNo;
    }

    const requestBody = JSON.stringify({
      active: true,
      vote: vote,
      dieAfter: dieAfters[rand2 % dieAfters.length],
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
    let nodeStatus = {
      opacity: "100%",
      border: "2px #3d4061 solid",
    };

    if (!this.state.active) {
      nodeStatus = {
        opacity: "40%",
        border: "2px #3d4061 solid",
      };
    }

    return (
      <div className="nodeControl" style={nodeStatus}>
        {this.state.isCoordinator ? (
          <h3> Coordinator ({this.state.nodeId})</h3>
        ) : (
          <h3>Subordinate ({this.state.nodeId})</h3>
        )}
        <div className="buttonSection">
          {this.state.isCoordinator ? (
            <div className="coordinatorSpecific">
              <Label>Die After:</Label>
              <Button.Group>
                <Button
                  color={this.state.dieAfter === "prepare" ? "black" : ""}
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
                  color={this.state.dieAfter === "commit/abort" ? "black" : ""}
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
                  color={this.state.dieAfter === "result" ? "black" : ""}
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
              <div className="vote">
                <Label>Vote:</Label>
                <Button.Group>
                  <Button
                    color={this.state.vote ? "green" : ""}
                    onClick={() => {
                      this.handleVote(true);
                    }}
                    disabled={!this.state.active}
                  >
                    Yes
                  </Button>
                  <Button
                    color={!this.state.vote ? "red" : ""}
                    onClick={() => {
                      this.handleVote(false);
                    }}
                    disabled={!this.state.active}
                  >
                    No
                  </Button>
                </Button.Group>
              </div>
              <div className="dieAfter">
                <Label>Die After:</Label>
                <Button.Group>
                  <Button
                    color={this.state.dieAfter === "prepare" ? "black" : ""}
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
                    color={this.state.dieAfter === "vote" ? "black" : ""}
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
                      color={
                        this.state.dieAfter === "commit/abort" ? "black" : ""
                      }
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
            </div>
          )}
        </div>

        <Log logitems={this.state.logitems} />
      </div>
    );
  }
}

export default withRouter(NodeControl);
