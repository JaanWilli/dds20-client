import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button } from "semantic-ui-react";

class Testpanel extends Component {
  state = {};
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
      </div>
    );
  }
}

export default withRouter(Testpanel);
