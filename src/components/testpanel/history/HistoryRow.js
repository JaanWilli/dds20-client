import React, { Component } from "react";
import {Table, Label, Icon, Loader, Progress } from "semantic-ui-react";

class HistoryRow extends Component {
  state = {};

  componentDidMount() {
    this.setState({current: 0, total: 24});

    this.progress = setInterval(() => {
      if (this.state.current < this.state.total) {
        this.setState({current: this.state.current + 1});
      } else {
        clearInterval(this.progress);
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.progress);
  }

  getStateLabel(log) {
    let label = "";
    for (let item of log) {
      if (item.message) {
        if (label === "") {
          label += item.message;
        } else {
          label += "/" + item.message;
        }
      }
    }
    return label;
  }

  getSuccess(nodes) {
    let states = [];
    if (nodes.length > 0) {
      for (let node of nodes) {
        if (node.isCoordinator && node.log.length >= 2
            && node.log[node.log.length - 1].message === "END") {
          states.push(node.log[node.log.length - 2].message);
        } else if (node.isSubordinate && node.log.length >= 1) {
          states.push(node.log[node.log.length - 1].message);
        } else {
          states.push(false);
        }
      }
      return states.every((val, i, arr) => val === arr[0]);
    }
  }

  render() {
    return (
      <Table.Row>
        {this.props.nodes.map((node) => {
          return (
            <Table.Cell key={node.nodeId}>
              {"vote: " + node.vote + " / dieAfter: " + node.dieAfter}
            </Table.Cell>
          );
        })}
        {this.props.nodes.length > 0 && this.props.nodes[0].log.length > 0 ?
          <Table.Cell>
            {this.props.nodes.map((node) => {
              return <Label>{this.getStateLabel(node.log)}</Label>;
            })}
          </Table.Cell>
          :
          <Table.Cell>
            <Progress
                percent={Math.round(this.state.current / this.state.total * 100)}
                size='small'
                indicating
            />
          </Table.Cell>
        }
        {this.props.nodes.length > 0 && this.props.nodes[0].log.length > 0 ?
          <Table.Cell>
            <Icon
                name={this.getSuccess(this.props.nodes) ? "check" : "remove"}
                color={this.getSuccess(this.props.nodes) ? "green" : "red"}
            />
          </Table.Cell>
          :
          <Table.Cell>
            <Loader active inline size="small" />
          </Table.Cell>
        }
      </Table.Row>
    );
  }
}

export default HistoryRow;
