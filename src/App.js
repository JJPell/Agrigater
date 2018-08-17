import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./views/Home";

import Report from "./views/report/Report";

import Arable from "./views/arable/Arable";
import ArableFarmForm from "./views/arable/ArableFarmForm";
import ArableFieldForm from "./views/arable/ArableFieldForm";
import ArableDetail from "./views/arable/ArableDetail";
import ArableFieldDetail from "./views/arable/ArableFieldDetail";
import ArableJobForm from "./views/arable/ArableJobForm";

import Livestock from "./views/livestock/Livestock";
import LivestockForm from "./views/livestock/LivestockForm";

import Stock from "./views/stock/Stock";
import StockForm from "./views/stock/StockForm";

import SignIn from "./views/signIn/SignIn";
import SignUp from "./views/SignUp";

import CssBaseline from '@material-ui/core/CssBaseline';


import "bootstrap-material-design/dist/css/bootstrap-material-design.min.css";


class App extends Component {
  render() {
    return (
        <Fragment>
            <CssBaseline />
            <Router>
                <Switch>
                    <Route exact path="/" component={Report} />
                    <Route 
                        path="/arable"
                        render={({ match: { url } }) => (
                            <Switch>
                                
                                <Route exact path={`${url}/`} component={Arable} />
                                <Route path={`${url}/addfarm`} component={ArableFarmForm} />
                                <Route path={`${url}/addfield`} component={ArableFieldForm} />
                                <Route path={`${url}/addjob`} component={ArableJobForm} />
                                <Route path={`${url}/field`} render={({ match: { url } }) => (
                                    <Switch>
                                        
                                        <Route path={`${url}/:id`} component={ArableFieldDetail} />
                                        
                                    </Switch>
                                )} />
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
                    <Route 
                        path="/stock"
                        render={({ match: { url } }) => (
                            <Switch>
                                
                                <Route exact path={`${url}/`} component={Stock} />
                                <Route path={`${url}/add`} component={StockForm} />
                                
                            </Switch>
                        )}
                    />
                    <Route exact path="/signin" component={SignIn} />
                    <Route exact path="/signup" component={SignUp} />
                </Switch>
            </Router>
        </Fragment>

    );
  }
}

export default App;