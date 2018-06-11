import React, { Component } from 'react';

import Dashboard from "./layout/Dashboard";


class Home extends Component {
  render() {

    return (
        <Dashboard hideSidebar="true">
          <h1>Home</h1>
          <hr />

          <label htmlFor="input-email" className="sr-only" >Username</label>
          
        </Dashboard>
    );
  }
}

export default Home;
