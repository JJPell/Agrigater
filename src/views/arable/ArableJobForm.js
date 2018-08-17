import React, { Component, Fragment } from 'react';
import gql from "graphql-tag";

import { Button, Paper, TextField, Select, MenuItem, Grow, CircularProgress } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

import Dashboard from "../layout/Dashboard";

import _ from "lodash";

import { compose, graphql } from "react-apollo";

import createJob from "../../mutations/createJob";
import listJobTypes from "../../queries/listJobTypes";

import Sidebar from "./ArableSidebar";

const styles = theme => ({
    progress: {
      margin: theme.spacing.unit * 2,
    },
  });

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
        const loaded = !this.props.listLands.loading && !this.props.listJobTypes.loading;

        const { classes } = this.props;

        return (
            <Dashboard sidebar={<Sidebar />}>

                {!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} className={classes.progress} size={50} /> : null}

                <Grow in={loaded}>
                    <Paper className="offset-md-2 col-md-8 offset-lg-4 col-lg-4">
                        <div className="card-body">
                            <h3 className="card-title">Add a Job to an Area</h3>
                            <hr />
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <Select
                                        fullWidth
                                        name="selectLand"
                                        label="Arable Area"
                                        value={selectLand}
                                        onChange={this.handleChange}
                                    >
                                    {listLands.map(land => (
                                        <MenuItem key={land.id} value={land.id}>
                                        {land.name}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </div>
                                <div className="form-group">
                                    <TextField
                                        select
                                        fullWidth
                                        name="selectJobType"
                                        label="Arable Area"
                                        value={selectJobType}
                                        onChange={this.handleChange}
                                        >
                                        {listJobTypes.map(jobType => (
                                            <MenuItem key={jobType.id} value={jobType.id}>
                                                {jobType.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                                <div className="form-group">
                                    <TextField
                                        type="date"
                                        fullWidth
                                        name="date"
                                        label="Job Date"
                                        placeholder=""
                                        value={date}
                                        onChange={this.handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

                                </div>
                                <Button variant="contained" color="primary" onClick={this.createJob.bind(this)}>Submit</Button>
                            </form>
                        </div>
                    </Paper>
                </Grow>
            </Dashboard>
        );
    }
}

export default withStyles(styles)(compose(

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

)(ArableJobForm));