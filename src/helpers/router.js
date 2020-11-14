import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import ControlPanel from "../components/controlpanel/ControlPanel";
import Settings from "../components/settings/Settings";
import Testpanel from "../components/testpanel/Testpanel";

class AppRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <div>
            <Route path="/settings" exact render={() => <Settings />} />
            <Route path="/controlpanel" exact render={() => <ControlPanel />} />
            <Route
              path="/"
              exact
              render={() => <Redirect to={"/settings"} />}
            />
            <Route path="/testpanel" exact render={() => <Testpanel />} />
          </div>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
