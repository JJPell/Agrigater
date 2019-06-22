import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ReportPage from "./views/report/ReportPage";
import ReportPrint from "./views/report/ReportPrint";

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

import Account from "./views/account/Account";

import SignIn from "./views/signIn/SignIn";

import CssBaseline from '@material-ui/core/CssBaseline';
import "bootstrap-material-design/dist/css/bootstrap-material-design.min.css";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#017A4E"
        },
        secondary: {
            main: "#FAB015",
        },
    },
    typography: {
        useNextVariants: true,
    },
});

class App extends Component {

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Switch>
                        <Route exact path="/" component={ReportPage} />
                        <Route exact path="/print" component={ReportPrint} />
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
                        <Route 
                            path="/account"
                            render={({ match: { url } }) => (
                                <Switch>
                                    
                                    <Route exact path={`${url}/`} component={Account} />
                                    
                                </Switch>
                            )}
                        />
                        <Route exact path="/signin" component={SignIn} />
                    </Switch>
                </Router>
            </MuiThemeProvider>

        );
    }
}

export default App;