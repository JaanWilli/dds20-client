import React, { Component } from "react";
import AppRouter from "./helpers/router";

class App extends Component {
  render() {
    return (
      <div>
        <h1>Control Panel</h1>
        <AppRouter />
      </div>
    );
  }
}

export default App;
