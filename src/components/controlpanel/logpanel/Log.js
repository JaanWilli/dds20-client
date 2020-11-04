import React, { Component } from "react";
import { Table } from "semantic-ui-react";

class Log extends Component {
  state = {};

  render() {
    return (
      <div className="logsection">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Message</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.logitems
              ? this.props.logitems.map((item) => {
                  return (
                    <Table.Row active={!item.isStatus}>
                      <Table.Cell>{item.message}</Table.Cell>
                    </Table.Row>
                  );
                })
              : ""}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default Log;
