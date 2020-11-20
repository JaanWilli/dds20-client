import React, { Component } from "react";
import { Table } from "semantic-ui-react";

class HistoryRow extends Component {
  state = { nodes: this.props.nodes };
  render() {
    return (
      <Table.Row>
        {this.state.nodes.map((node) => {
          return (
            <Table.Cell key={node.nodeId}>
              {"vote: " + node.vote + " / dieAfter: " + node.dieAfter}
            </Table.Cell>
          );
        })}
      </Table.Row>
    );
  }
}

export default HistoryRow;
