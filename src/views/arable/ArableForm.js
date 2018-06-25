import React, { Component } from 'react';

import Dashboard from "../layout/Dashboard";

import { graphql } from "react-apollo";
import createLand from "../../mutations/createLand";

import { sidebarLinks } from "./sidebar";

class ArableForm extends Component {

    state = {
        name: "",
        size: ""
    }

    updateName(event) {
        this.state.name = event.target.value;
    }

    updateSize(event) {
        this.state.size = event.target.value;
    }

    addArable(event) {

        console.log(this.state);
        this.props.onAdd(this.state).then(response => {
            this.props.history.replace("/arable");
        });


    }

    render() {

        return (
            <Dashboard sidebar={sidebarLinks}>
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title">Add New Arable</h3>
                    <hr />
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label>Name of Area</label>
                            <input type="text" className="form-control" placeholder="name e.g. rectory farm" onChange={this.updateName.bind(this)}/>
                        </div>
                        <div className="form-group">
                            <label>Size of Area</label>
                            <input type="text" className="form-control" placeholder="size in acres" onChange={this.updateSize.bind(this)}/>
                        </div>
                        <div className="form-group">
                            <label>Type of arable area</label>
                            <select className="form-control">
                                <option>Farm</option>
                                <option>Field</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <button className="btn btn-primary" type="button" onClick={this.addArable.bind(this)}>Submit</button>
                    </form>
                </div>
            </div>
            </Dashboard>
        );
    }
}

// TODO:  https://youtu.be/qNkkPoq9D3k?t=34m
export default graphql(createLand, {
	props: props => ({
		onAdd: land => props.mutate({
            variables: land
        })
	})
}

)(ArableForm);
