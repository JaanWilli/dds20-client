import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import Log from "./logpanel/Log";

class CoordinatorControl extends Component {
  state = {};

  async startTransaction() {
    console.log("The transaction starts");
    // try {
    //   const response = await api.post("/?");
    // } catch (error) {
    //   alert(`Something went wrong: \n${handleError(error)}`);
    // }
  }

  render() {
    return (
      <div className="nodeControl">
        <h3>Coordinator</h3>
        <div className="buttonSection">
          <Button onClick={this.startTransaction}>Start Transaction</Button>
          <Button>Flag1</Button>
        </div>

        <Log />
      </div>
    );
  }
}

export default CoordinatorControl;
