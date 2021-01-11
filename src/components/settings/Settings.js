import React, { Component } from "react";
import { Button, Table, Input, Icon } from "semantic-ui-react";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import {
  getConfigCoordinator,
  getConfigSubordinates,
} from "../../helpers/getConfig";
import { apiGet } from "../../helpers/api";

class Settings extends Component {
  state = {
    coordinator: "",
    subordinates: [],
    online: []
  };

  componentDidMount() {
    let coordinator;
    let subordinates;
    if (localStorage.getItem("nodes")) {
      coordinator = this.getCoordinatorFromStorage();
      subordinates = this.getSubordinatesFromStorage();
    } else {
      coordinator = getConfigCoordinator();
      subordinates = getConfigSubordinates();
    }

    this.setState({
      coordinator: coordinator,
      subordinates: subordinates
    });
    this.isOnline(coordinator.nodeId);
    for (let subordinate of subordinates) {
      this.isOnline(subordinate.nodeId);
    }
  }

  pushDataToLocalStorage() {
    let coordinator = [];
    coordinator.push(this.state.coordinator);
    let nodes = [...coordinator, ...this.state.subordinates];
    localStorage.removeItem("nodes");
    localStorage.setItem("nodes", JSON.stringify(nodes));
  }

  start() {
    this.pushDataToLocalStorage();
    this.props.history.push(`/controlpanel`);
  }

  test() {
    this.pushDataToLocalStorage();
    this.props.history.push(`/testpanel`);
  }

  getCoordinatorFromStorage() {
    let nodes = JSON.parse(localStorage.getItem("nodes"));
    let coordinator = nodes.filter((node) => {
      return node.isCoordinator;
    });
    return coordinator[0];
  }

  getSubordinatesFromStorage() {
    let nodes = JSON.parse(localStorage.getItem("nodes"));
    let subordinates = nodes.filter((node) => {
      return node.isSubordinate;
    });
    return subordinates;
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
    let coordinator = this.state.coordinator;
    coordinator.nodeId = newPath;
    this.setState({ coordinator: coordinator });
    this.rebase();
    this.isOnline(newPath);
  }

  updateSubordinates(newPath, index) {
    let subordinates = this.state.subordinates;
    let subordinate = subordinates[index];
    subordinate.nodeId = newPath;

    subordinates[index] = subordinate;
    this.setState({ subordinates: subordinates });
    this.rebase();
    this.isOnline(newPath);
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

  async isOnline(path) {
    console.log("API POST /");
    let online = false;
    try {
      let response = await apiGet(path, "")
          .then(data => {return data});
      if (response.status === 200) {
        online = true;
      }
    } catch (error) {}
    let list = this.state.online;
    if (online && !list.includes(path)) {
      list.push(path);
    }
    else if (!online && list.includes(path)) {
      const idx = list.indexOf(path);
      list.splice(idx, 1);
    }
    this.setState({online: list});
  }

  render() {
    return (
      <div>
        <div className="settings">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Coordinator</Table.HeaderCell>
                <Table.HeaderCell/>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.coordinator ? (
                <Table.Row>
                  <Table.Cell>
                    <Input
                      value={this.state.coordinator.nodeId}
                      onChange={(e) => this.updateCoordinator(e.target.value)}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Button className="connectionStatus"
                            icon
                            color={this.state.online.includes(this.state.coordinator.nodeId) ?
                                "green" : "red"}
                    >
                      {this.state.online.includes(this.state.coordinator.nodeId) ?
                          <Icon name="check" /> : <Icon name="remove" /> }
                    </Button>
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
                <Table.HeaderCell/>
                <Table.HeaderCell/>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.subordinates
                ? this.state.subordinates.map((node, index) => {

                    return (
                      <Table.Row>
                        <Table.Cell>
                          <Input
                            value={node.nodeId}
                            onChange={(e) =>
                              this.updateSubordinates(e.target.value, index)
                            }
                          />
                        </Table.Cell>
                        <Table.Cell>{node.coordinator}</Table.Cell>
                        <Table.Cell textAlign="right">
                          <Button
                            onClick={() => this.removeSubordinate(index)}
                            icon
                          >
                            <Icon name="trash" />
                          </Button>
                        </Table.Cell>
                        <Table.Cell>
                          <Button className="connectionStatus"
                            icon
                            color={this.state.online.includes(node.nodeId) ?
                                "green" : "red"}
                          >
                            {this.state.online.includes(node.nodeId) ?
                                <Icon name="check" /> : <Icon name="remove" /> }
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                : ""}
            </Table.Body>
          </Table>

          <Button icon onClick={() => this.addSubordinate()}>
            <Icon name="plus square" />
            Subordinate
          </Button>
          <Button onClick={() => this.start()}>Start</Button>
          <Button onClick={() => this.test()}>Test Panel</Button>
        </div>
      </div>
    );
  }
}

export default withRouter(Settings);
