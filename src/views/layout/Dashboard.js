import React, { Component } from 'react';

import Nav from "./Nav";
import Sidebar from "./Sidebar";

class Dashboard extends Component {
  render() {

    return (
 
        <div>
            <Nav></Nav>
            <main className="container-fluid">
                <div className="row">
                    <div className={this.props.hideSidebar ? "d-none" : "col-2"}>
                        <Sidebar links={ this.props.sidebar }></Sidebar>
                    </div>
                    <div className={this.props.hideSidebar ? "content col-12" : "content col-10"}>
                        {this.props.children}
                    </div>
                </div>
            </main>
        </div>
        
    );
  }
}

export default Dashboard;
