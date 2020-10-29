import React, { Component } from "react";
import { Button, Table, Input, Icon } from "semantic-ui-react";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import {
  getConfigCoordinator,
  getConfigSubordinates,
} from "../../helpers/getConfig";

class Settings extends Component {
  state = {
    coordinator: "",
    subordinates: [],
  };

  componentDidMount() {
    let configCoordinator = getConfigCoordinator();
    let configSubordinates = getConfigSubordinates();

    this.setState({
      coordinator: configCoordinator,
      subordinates: configSubordinates,
    });
  }

  start() {
    let coordinator = [];
    coordinator.push(this.state.coordinator);
    let nodes = [...coordinator, ...this.state.subordinates];
    localStorage.removeItem("nodes");
    localStorage.setItem("nodes", JSON.stringify(nodes));
    console.log(nodes);
    this.props.history.push(`/controlpanel`);
  }

  rebase() {
    let subordinates = this.state.subordinates;
    subordinates.forEach((sub) => {
      sub.coordinator = this.state.coordinator.nodeId;
    });
    this.setState({ subordinates: subordinates });

    let coordinator = this.state.coordinator;
    let subordinatesList = [];
    this.state.subordinates.forEach((sub) => {
      subordinatesList.push(sub.nodeId);
    });
    coordinator.subordinates = subordinatesList;
    this.setState({ coordinator: coordinator });
  }

  updateCoordinator(newPath) {
    this.setState({ coordinator: newPath });
    this.rebase();
  }

  updateSubordinates(newPath, index) {
    let subordinates = this.state.subordinates;
    let subordinate = subordinates[index];
    subordinate.nodeId = newPath;

    subordinates[index] = subordinate;
    this.setState({ subordinates: subordinates });
    this.rebase();
  }

  removeSubordinate(index) {
    let subordinates = this.state.subordinates;
    subordinates.splice(index, 1);
    this.setState({ subordinates: subordinates });
    this.rebase();
  }

  addSubordinate() {
    let subordinates = this.state.subordinates;
    const newSubordinate = {
      nodeId: getDomain() + "X",
      isCoordinator: false,
      isSubordinate: true,
      subordinates: [],
      coordinator: this.state.coordinator.nodeId,
    };
    subordinates.push(newSubordinate);
    this.setState({ subordinates: subordinates });
    this.rebase();
  }
  render() {
    return (
      <div className="settings">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Coordinator</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.coordinator ? (
              <Table.Row>
                <Table.Cell>
                  <Input
                    defaultValue={this.state.coordinator.nodeId}
                    onChange={(e) => this.updateCoordinator(e.target.value)}
                  />
                </Table.Cell>
              </Table.Row>
            ) : (
              ""
            )}
          </Table.Body>
        </Table>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Subordinates</Table.HeaderCell>
              <Table.HeaderCell>Coordinator</Table.HeaderCell>
              <Table.HeaderCell>Remove</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.subordinates
              ? this.state.subordinates.map((node, index) => {
                  return (
                    <Table.Row>
                      <Table.Cell>
                        <Input
                          defaultValue={node.nodeId}
                          onChange={(e) =>
                            this.updateSubordinates(e.target.value, index)
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>{node.coordinator}</Table.Cell>
                      <Table.Cell>
                        <Button
                          onClick={() => this.removeSubordinate(index)}
                          icon
                        >
                          <Icon name="trash"></Icon>
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              : ""}
          </Table.Body>
        </Table>

        <Button onClick={() => this.addSubordinate()}>Add Subordinate</Button>
        <Button onClick={() => this.start()}>Start</Button>
      </div>
    );
  }
}

export default withRouter(Settings);
