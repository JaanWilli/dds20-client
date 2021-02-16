import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Table, Icon } from "semantic-ui-react";
import { apiGet, apiPost, handleError } from "../../helpers/api";
import HistoryRow from "./history/HistoryRow";
import { v4 as uuid } from 'uuid';

class Testpanel extends Component {
  state = {
    nodeConfig: [],
    nodes: [],
    history: [],
    session: ""
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
      log: [],
    }));

    this.setState({ nodeConfig: extendedNodes, history: [], session: uuid() });

    this.initial = setInterval(() => {
      this.restart()
      clearInterval(this.initial);
    }, 2000);
  }

  restart() {
    this.generateTestCase();
    this.sendSetups();
  }

  generateTestCase() {
    let nodes = JSON.parse(JSON.stringify(this.state.nodeConfig));
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

  sendSetups() {
    for (let node of this.state.nodes) {
      this.sendSingleSetup(node);
    }
    setTimeout(() => {
      this.sendNodeSettings();
    }, 1000);
  }

  async sendSingleSetup(node) {
    const requestBody = JSON.stringify({
      node: node.nodeId,
      isCoordinator: node.isCoordinator,
      isSubordinate: node.isSubordinate,
      subordinates: node.subordinates,
      coordinator: node.coordinator,
    });

    console.log("API POST /setup", requestBody);
    try {
      await apiPost(node.nodeId, "/setup?session=" + this.state.session, requestBody);
    } catch (error) {
      //alert(`Something went wrong: \n${handleError(error)}`);
      this.back();
    }
  }

  sendNodeSettings() {
    for (let node of this.state.nodes) {
      this.sendSingleSetting(node);
    }
    setTimeout(() => {
      this.startTransaction();
    }, 2000);
  }

  async sendSingleSetting(node) {
    const requestBody = JSON.stringify({
      active: true,
      dieAfter: node.dieAfter,
      vote: node.vote,
    });

    console.log("API POST /settings", requestBody);
    try {
      await apiPost(node.nodeId, "/settings?session=" + this.state.session, requestBody);
    } catch (error) {
      //alert(`Something went wrong: \n${handleError(error)}`);
      this.back();
    }
  }

  async startTransaction() {
    let coordinator = this.state.nodes[0];

    console.log("API POST /start");
    try {
      await apiPost(coordinator.nodeId, "/start?session=" + this.state.session);
    } catch (error) {
      //alert(`Something went wrong: \n${handleError(error)}`);
      this.back();
    }

    setTimeout(() => {
      this.getResults();
    }, 20000);
  }

  getResults() {
    for (let node of this.state.nodes) {
      this.getSingleLog(node);
    }
    setTimeout(() => {
      console.log("Finished");
      this.restart();
    }, 1000);
  }

  async getSingleLog(node) {
    console.log("API GET /info");
    try {
      const logResponse = await apiGet(node.nodeId, "/info?session=" + this.state.session);
      node.log = logResponse.data.filter((item) => {
        return !item.isStatus;
      });
    } catch (error) {
      //alert(`Something went wrong: \n${handleError(error)}`);
      this.back();
    }
  }

  back() {
    this.props.history.push(`/settings`);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <div>
        <div className="header">
          <Button
            onClick={() => this.back()}
            className="left ui labeled icon button"
          >
            <Icon className="left chevron icon" />
            Back
          </Button>
        </div>
        <div className="testTable">
          <Table>
            <Table.Header>
              <Table.Row>
                {this.state.nodeConfig
                  ? this.state.nodeConfig.map((node) => {
                      return (
                        <Table.HeaderCell key={node.nodeId}>
                          {node.nodeId}
                        </Table.HeaderCell>
                      );
                    })
                  : ""}
                <Table.HeaderCell id="states">States</Table.HeaderCell>
                <Table.HeaderCell>Success</Table.HeaderCell>
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
