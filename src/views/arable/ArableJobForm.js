import React, { Component } from 'react';
import gql from "graphql-tag";

import Dashboard from "../layout/Dashboard";

import { compose, graphql } from "react-apollo";

import Select from 'react-select';
import 'react-select/dist/react-select.css';

const sidebarLinks = [{
    name: "Add Area Job",
    icon: "add",
    href: "./addjob"
}];



class ArableJobForm extends Component {

    state = {

        selectedOption: '',

    }

    landOnChange(selectedOption) {

        this.setState({ selectedOption });
        console.log(`Selected: ${selectedOption.label}`);

    }

    render() {

        const { selectedOption } = this.state;

        return (
            <Dashboard sidebar={sidebarLinks}>
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title">Add New Arable Job</h3>
                        <hr />
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label>Example select</label>
                                <select className="form-control" >
                                    {this.props.landOptions.map(function(land) {
                                        return <option value={land.id}>{land.name}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Job Type</label>
                                <input type="text" className="form-control" placeholder="name e.g. rectory farm" />
                            </div>
                            <div className="form-group">
                                <label>Date of Job</label>
                                <input type="text" className="form-control" placeholder="size in acres" />
                            </div>
                            <button className="btn btn-primary" type="button" >Submit</button>
                        </form>
                    </div>
                </div>
            </Dashboard>
        );
    }
}

export default graphql(gql`

    query listLands {
  
        listLands{
            items {
                id
                name
            }
        }

    }

`, {
	options: {
		fetchPolicy: "cache-and-network"
	},
	props: props => ({
		landOptions: props.data.listLands ? props.data.listLands.items : []
	})
}

)(ArableJobForm);