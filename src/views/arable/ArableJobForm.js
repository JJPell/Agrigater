import React, { Component } from 'react';
import gql from "graphql-tag";

import Dashboard from "../layout/Dashboard";

import { compose, graphql } from "react-apollo";

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import createJob from "../../mutations/createJob";
import listJobTypes from "../../queries/listJobTypes";

import { sidebarLinks } from "./sidebar";


class ArableJobForm extends Component {

    constructor(props) {
        super(props);
        // bind once here, better than multiple times in render
        this.handleChange = this.handleChange.bind(this);

        this.setSelectLand = false;
        
    }

    state = { 
        selectLand: "",
        selectJobType: "",
        date: "",
    };

    getIdFromUrl() {
        let url = this.props.location.pathname;
        url = url.replace("/arable/", "");
        url = url.replace("addjob", "");
        url = url.replace("/", "");
        return url;
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    createJob() {

        const {selectLand, selectJobType, date} = this.state;

        this.props.addJob({land: selectLand, jobType: selectJobType, date}).then(response => {
            this.props.history.replace("/arable/"+this.state.selectLand);
        });

    }

    componentWillReceiveProps(newProps){
        // Set Initial Values
        if(!newProps.listLands.loading){
            this.setState({
                selectLand: this.getIdFromUrl() || newProps.listLands.listLands[0].id
            });
        }
        if(!newProps.listJobTypes.loading){
            this.setState({
                selectJobType: newProps.listJobTypes.listJobTypes[0].id
            });
        }
    }

    render() {
        const { selectLand, selectJobType, date } = this.state;
        const listLands = this.props.listLands.listLands || [];
        const listJobTypes = this.props.listJobTypes.listJobTypes || [];

        //console.log(listLands)
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
                                <label>Arable Area</label>
                                <select key={this.props.listLands.loading ? 'notLoadedYet' : 'loaded'} name="selectLand" className="form-control" value={selectLand} onChange={this.handleChange}>
                                    {listLands.map(function(land) {
                                        return <option key={land.id} value={land.id}>{land.name}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Job Type</label>
                                <select name="selectJobType" className="form-control" value={selectJobType} onChange={this.handleChange}>
                                    {listJobTypes.map(function(jobType) {
                                        return <option key={jobType.id} value={jobType.id}>{jobType.name}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date of Job</label>
                                <input type="date" name="date" className="form-control" value={date} onChange={this.handleChange} />
                            </div>
                            <button className="btn btn-primary" type="button" onClick={this.createJob.bind(this)} >Submit</button>
                        </form>
                    </div>
                </div>
            </Dashboard>
        );
    }
}

export default compose(

    graphql(gql`

        query listLands {
    
            listLands{
                id
                name
            }

        }

    `, {
        name: "listLands",
        options: {
            fetchPolicy: "cache-and-network"
        }
    }),
    graphql(listJobTypes, {
        name: "listJobTypes",
        options: {
            fetchPolicy: "cache-and-network"
        }
    }),
    graphql(createJob, {
        props: props => ({
            addJob: args => props.mutate({
                variables: args
            })
        })
    })

)(ArableJobForm);