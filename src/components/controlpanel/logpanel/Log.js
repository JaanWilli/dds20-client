import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import { api, handleError } from "../../../helpers/api";

class Log extends Component {
  state = {
    logitems: [
      "Abort",
      "Commit",
      "Abort",
      "Commit",
      "Abort",
      "Commit",
      "Abort",
      "Commit",
      "Abort",
      "Commit",
      "Abort",
      "Commit",
      "Abort",
      "Commit",
      "Abort",
      "Commit",
    ],
  };

  async componentDidMount() {
    // try {
    //   const response = await api.get("/info");
    //   this.setState({ logitems: response.logs });
    // } catch (error) {
    //   alert(`Something went wrong: \n${handleError(error)}`);
    // }
  }

  render() {
    return (
      <div className="logsection">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Log</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.logitems.map((item) => {
              return (
                <Table.Row>
                  <Table.Cell>{item}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default Log;
