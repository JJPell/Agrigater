import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./views/Home";

import Arable from "./views/arable/Arable";
import ArableForm from "./views/arable/ArableForm";
import ArableDetail from "./views/arable/ArableDetail";
import ArableJobForm from "./views/arable/ArableJobForm";

import SignIn from "./views/signIn/SignIn";
import SignUp from "./views/SignUp";

import "bootstrap-material-design/dist/css/bootstrap-material-design.min.css";
//import "./govstrap/styles/govstrap.css";
// import "./bootstrap/bootstrap.min.js";

class App extends Component {
  render() {
    return (

        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/arable"

                    render={({ match: { url } }) => (
                        <Switch>
                            
                            <Route exact path={`${url}/`} component={Arable} />
                            <Route path="/arable/add" component={ArableForm} />
                            <Route path={`${url}/:id`} component={ArableDetail} />
                            
                        </Switch>
                    )}

                />
                 

                <Route exact path="/signin" component={SignIn} />
                <Route exact path="/signup" component={SignUp} />
            </Switch>
        </Router>

    );
  }
}

export default App;