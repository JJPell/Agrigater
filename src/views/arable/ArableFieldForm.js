import React, { Component } from 'react';

import Dashboard from "../layout/Dashboard";

import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";

import createLand from "../../mutations/createLand";

import {Button, Paper, TextField, Select, Input, MenuItem, Grow, CircularProgress} from '@material-ui/core';

import Sidebar from "./ArableSidebar";

class ArableFieldForm extends Component {

    state = {
        name: "",
        parent: "",
        size: "",
        sizeUnit: "hectares",
        seedCost: "",
        fertiliserCost: "",
        limeCost: "",
        sprayCost: "",
        cultivationCost: "",
        licenceCost: "",
        validationErrors: {}
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    validate(input) {

        let validationErrors = {};
        let isError = false;

        if(!input.name || (input.name === "")) {

            isError=true;
            validationErrors.name = "A Field Name is required."

        }

        if(!input.size || (input.size === "")) {
            
            isError=true;
            validationErrors.size = "A Field Size is required."

        }

        if(!input.parent || (input.parent === "")) {
            
            isError=true;
            validationErrors.parent = "You must select a farm to assign the new field to."

        }

        console.log(validationErrors)

        if(isError) {

            this.setState({
                validationErrors
            });

        }

        return isError;

    }

    addArable(event) {

        const hectaresPerAcres = 0.404686;
        let input = {
            name:                   this.state.name,
            size:                   this.state.sizeUnit === "acres" ? (this.state.size * hectaresPerAcres) : this.state.size,
            parent:                 this.state.parent,
            seedCost:               this.state.seedCost,
            fertiliserCost:         this.state.fertiliserCost,
            limeCost:               this.state.limeCost,
            sprayCost:              this.state.sprayCost,
            cultivationCost:        this.state.cultivationCost,
            licenceCost:            this.state.licenceCost,
        }

        for (var prop in input) {
            if(input[prop]==="") {
                delete input[prop];
            }
        }

        let isError = this.validate(input);
        if(!isError) {
            this.props.onAdd({input}).then(response => {
                this.props.history.replace("/arable/"+input.parent);
            });
        }

    }

    render() {

        const farms = this.props.data.listFarms || [];

        const loaded = !this.props.data.loading;
        
        const { 
            name,
            parent,
            size, 
            sizeUnit,
            seedCost,
            fertiliserCost,
            limeCost,
            sprayCost,
            cultivationCost,
            licenceCost,
            validationErrors
        } = this.state;

        console.log(this.props)

        return (
            <Dashboard sidebar={<Sidebar />}>

                {!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} size={50} /> : null}

                <Grow in={loaded}>
                    <Paper className="offset-md-2 col-md-8 offset-lg-4 col-lg-4">
                        <div className="card-body">
                            <h3 className="card-title">Create a New Field</h3>
                            <hr />
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <h5>Field belongs to...</h5>
                                        <div className="form-group">
                                            <Select
                                                value={parent}
                                                onChange={this.handleChange.bind(this)}
                                                input={<Input name="parent" />}
                                                className="mt-3"
                                                fullWidth
                                                helperText={validationErrors.parent}
                                                error={validationErrors.parent ? true:false}
                                            >
                                                {farms.map(farm => (
                                                    <MenuItem key={farm.id} value={farm.id}>
                                                    {farm.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                        <h5>Basic Info</h5>
                                        <div className="form-group">
                                            <TextField
                                                name="name"
                                                type="text"
                                                label="Field Name"
                                                fullWidth
                                                value={name}
                                                onChange={this.handleChange.bind(this)}
                                                helperText={validationErrors.name}
                                                error={validationErrors.name ? true:false}
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <TextField
                                                        name="size"
                                                        type="number"
                                                        label="Field Size"
                                                        value={size}
                                                        onChange={this.handleChange.bind(this)}
                                                        fullWidth
                                                        helperText={validationErrors.size}
                                                        error={validationErrors.size ? true:false}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <Select
                                                        value={sizeUnit}
                                                        onChange={this.handleChange.bind(this)}
                                                        input={<Input name="sizeUnit" />}
                                                        className="mt-3"
                                                        fullWidth
                                                    >
                                                        <MenuItem value={"hectares"}>Hectares</MenuItem>
                                                        <MenuItem value={"acres"}>Acres</MenuItem>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <h5>Costs</h5>
                                        <div className="form-group">
                                            <TextField
                                                name="seedCost"
                                                type="number"
                                                label="Seed Cost"
                                                value={seedCost}
                                                onChange={this.handleChange.bind(this)}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="form-group">
                                            <TextField
                                                name="fertiliserCost"
                                                type="number"
                                                label="Fertiliser Cost"
                                                value={fertiliserCost}
                                                onChange={this.handleChange.bind(this)}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="form-group">
                                            <TextField
                                                name="limeCost"
                                                type="number"
                                                label="Lime Cost"
                                                value={limeCost}
                                                onChange={this.handleChange.bind(this)}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="form-group">
                                            <TextField
                                                name="sprayCost"
                                                type="number"
                                                label="Spray Cost"
                                                value={sprayCost}
                                                onChange={this.handleChange.bind(this)}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="form-group">
                                            <TextField
                                                name="cultivationCost"
                                                type="number"
                                                label="Cultivation Cost"
                                                value={cultivationCost}
                                                onChange={this.handleChange.bind(this)}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="form-group">
                                            <TextField
                                                name="licenceCost"
                                                type="number"
                                                label="Licence Cost"
                                                value={licenceCost}
                                                onChange={this.handleChange.bind(this)}
                                                fullWidth
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="d-inline-flex flex-row-reverse w-100">
                                            <Button type="button" variant="contained" color="primary" onClick={this.addArable.bind(this)}>Submit</Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Paper>
                </Grow>
            </Dashboard>
        );
    }
}

// TODO:  https://youtu.be/qNkkPoq9D3k?t=34m
export default compose(
    graphql(gql`

        mutation createField(
            $input: FieldInput!
        ) {
            createField(
                input: $input
            ) {
                id
            }
        }

    `, {
        props: props => ({
            onAdd: land => props.mutate({
                variables: land
            })
        })
    }),
    graphql(gql`
        query listFarms {
			listFarms {
				id
				name
			}
		}
    `)
)(ArableFieldForm);