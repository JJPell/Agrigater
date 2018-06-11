import React, { Component } from 'react';

import Nav from "./Nav";
import Sidebar from "./Sidebar";

class Dashboard extends Component {
  render() {

    return (
 
        <div>
            <Nav></Nav>
            <main className="row">
                <div className="col-2">
                    <Sidebar links={ this.props.sidebar }></Sidebar>
                </div>
                <div className="content col-10">
                    {this.props.children}
                </div>
            </main>
        </div>
        
    );
  }
}

export default Dashboard;
