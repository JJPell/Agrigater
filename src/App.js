import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./views/Home";

import Arable from "./views/arable/Arable";
import ArableForm from "./views/arable/ArableForm";
import ArableDetail from "./views/arable/ArableDetail";
import ArableJobForm from "./views/arable/ArableJobForm";

import Livestock from "./views/livestock/Livestock";
import LivestockForm from "./views/livestock/LivestockForm";

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
                <Route 
                    path="/arable"
                    render={({ match: { url } }) => (
                        <Switch>
                            
                            <Route exact path={`${url}/`} component={Arable} />
                            <Route path={`${url}/add`} component={ArableForm} />
                            <Route path={`${url}/addjob`} component={ArableJobForm} />
                            <Route path={`${url}/:id`} render={({ match: { url } }) => (
                                <Switch>
                                    
                                    <Route path={`${url}/addjob`} component={ArableJobForm} />
                                    <Route component={ArableDetail} />

                                    
                                </Switch>
                            )} />
                            
                        </Switch>
                    )}
                />
                <Route 
                    path="/livestock"
                    render={({ match: { url } }) => (
                        <Switch>
                            
                            <Route exact path={`${url}/`} component={Livestock} />
                            <Route path={`${url}/add`} component={LivestockForm} />
                            
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