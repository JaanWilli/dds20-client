import React, { Component } from "react";
import { Table, Label } from "semantic-ui-react";

class HistoryRow extends Component {
  state = {};

  getStateLabel(log) {
    console.log(log);
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
        <Table.Cell>
          {this.props.nodes.map((node) => {
            return <Label>{this.getStateLabel(node.log)}</Label>;
          })}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default HistoryRow;
