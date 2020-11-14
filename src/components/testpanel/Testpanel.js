import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Table } from "semantic-ui-react";

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
    let history = this.state.history;
    history.push(this.state.nodes);
    this.setState({ history: history });
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
              {this.state.nodes
                ? this.state.nodes.map((node) => {
                    return <Table.HeaderCell>{node.nodeId}</Table.HeaderCell>;
                  })
                : ""}
              <Table.HeaderCell>Passed</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              {this.state.history.map((h) => {
                return (
                  <Table.Row>
                    {h.map((node) => {
                      return (
                        <Table.Cell>
                          {"vote: " +
                            node.vote +
                            " / dieAfter: " +
                            node.dieAfter}
                        </Table.Cell>
                      );
                    })}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </div>
    );
  }
}

export default withRouter(Testpanel);
