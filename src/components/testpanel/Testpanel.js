import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Table } from "semantic-ui-react";
import HistoryRow from "./history/HistoryRow";

class Testpanel extends Component {
  state = {
    nodes: [],
    history: [],
  };

  componentDidMount() {
    let nodes = JSON.parse(localStorage.getItem("nodes"));

    let extendedNodes = nodes.map((n) => ({
      nodeId: n.nodeId,
      isCoordinator: n.isCoordinator,
      isSubordinate: n.isSubordinate,
      subordinates: n.subordinates,
      coordinator: n.coordinator,
      dieAfter: "never",
      vote: true,
      logitems: [],
    }));

    this.setState({ nodes: extendedNodes, history: [] });

    this.intervalId = setInterval(() => {
      this.startTestCase();
    }, 2000);
  }

  startTestCase() {
    let nodes = JSON.parse(JSON.stringify(this.state.nodes));
    let randomizedNodes = nodes.map((node) => {
      this.setRandomNodeSettings(node);
      return node;
    });

    this.updateHistory(randomizedNodes);
    this.setState({ nodes: randomizedNodes });
  }

  updateHistory(newNodes) {
    let newHistory = this.state.history;
    newHistory.push(newNodes);
    this.setState({ history: newHistory, toggleVote: !this.state.toggleVote });
  }

  setRandomNodeSettings(node) {
    let rand1 = Math.floor(Math.random() * 100);
    let rand2 = Math.floor(Math.random() * 100);

    const votes = [true, false];
    const dieAfterCoordinator = ["never", "prepare", "commit/abort", "result"];
    const dieAfterSubordinateYes = ["never", "prepare", "vote", "commit/abort"];
    const dieAfterSubordinateNo = ["never", "prepare", "vote"];

    let vote;
    let dieAfters;
    if (node.isCoordinator) {
      vote = true;
      dieAfters = dieAfterCoordinator;
    } else {
      vote = votes[rand1 % 2];
      dieAfters = vote ? dieAfterSubordinateYes : dieAfterSubordinateNo;
    }

    node.vote = vote;
    node.dieAfter = dieAfters[rand2 % dieAfters.length];
    return node;
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <div>
        <div className="header">
          <Button
            circular
            icon="settings"
            onClick={() => this.props.history.push(`/settings`)}
          />
        </div>
        <div className="testTable">
          <Table>
            <Table.Header>
              <Table.Row>
                {this.state.nodes
                  ? this.state.nodes.map((node) => {
                      return (
                        <Table.HeaderCell key={node.nodeId}>
                          {node.nodeId}
                        </Table.HeaderCell>
                      );
                    })
                  : ""}
                <Table.HeaderCell>Passed</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.history.map((row) => {
                return <HistoryRow nodes={row} />;
              })}
            </Table.Body>
          </Table>
        </div>
      </div>
    );
  }
}

export default withRouter(Testpanel);
