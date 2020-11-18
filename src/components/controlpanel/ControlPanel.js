import React, { Component } from "react";
import NodeControl from "./NodeControl";
import { Button, Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import {apiPost} from "../../helpers/api";

class ControlPanel extends Component {
  state = {
    random: false
  };

  back() {
    this.props.history.push(`/settings`);
  }

  toggleRandom() {
    if (localStorage.getItem("random")) {
      localStorage.removeItem("random");
      this.setState({random: false});
    } else {
      localStorage.setItem("random", true);
      this.setState({random: true});
    }
    this.reload();
  }

  reload() {
    window.location.reload(false);
  }

  async startTransaction() {
    const node = JSON.parse(localStorage.getItem("nodes"))[0];
    console.log("API POST /start");
    try {
      await apiPost(node.nodeId, "/start");
    } catch (error) {
      //alert(`Something went wrong: \n${handleError(error)}`);
      this.back();
    }
  }

  render() {
    const nodes = JSON.parse(localStorage.getItem("nodes"));

    return (
      <div>
        <div className="header">
          <Button
              onClick={() => this.back()}
              className="left ui labeled icon button"
          >
            <Icon className="left chevron icon" />
            Back
          </Button>
          <Button
              onClick={() => this.reload()}
              className="left ui labeled icon button"
          >
            <Icon className="redo icon"/>
            Reset
          </Button>
          <Button
              toggle
              active={!!localStorage.getItem("random")}
              onClick={() => this.toggleRandom()}
              className="left ui labeled icon button"
          >
            <Icon className="random icon"/>
            Random
          </Button>
          <Button
              primary
              onClick={() => this.startTransaction()}
              className="left ui labeled icon button"
          > Run
            <Icon name="play"/>
          </Button>
        </div>
        <div className="nodes">
          {nodes.map((node) => {
            return (
              <NodeControl
                nodeId={node.nodeId}
                isCoordinator={node.isCoordinator}
                isSubordinate={node.isSubordinate}
                subordinates={node.subordinates}
                coordinator={node.coordinator}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default withRouter(ControlPanel);
