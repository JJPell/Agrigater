import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {withApollo} from "react-apollo";


class Nav extends Component {

    signOut = () => {

        localStorage.removeItem("token");
        this.props.client.resetStore()

    }

    render() {
        return (

            <nav className="navbar navbar-expand-md navbar-dark bg-primary">
                <a className="navbar-brand" href="/">Agrigater</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav col-8 pl-2">
                            <li className="nav-item active">
                                <Link to="/" className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/arable" className="nav-link">Arable</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/livestock">Livestock</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/stock">Stock</a>
                            </li>
                        </ul>
                        <ul className="navbar-nav col-4">
                            <li className="nav-item ml-auto">
                                <Link to="/signin" onClick={this.signOut}  className="nav-link">Sign Out</Link>
                            </li>
                        </ul>
                    </div>
            </nav>
            
        );
    }
}

export default withApollo(Nav);