import React, { Component } from 'react';

import Dashboard from "../layout/Dashboard";

import { graphql } from "react-apollo";
import gql from "graphql-tag";

import {Button, Paper, TextField, Select, Input, MenuItem, Grow, CircularProgress} from '@material-ui/core';

import Sidebar from "./ArableSidebar";

const createFarm = gql`

    mutation createFarm(
        $input: FarmInput!
    ) {
        createFarm(
            input: $input
        ) {
            id
        }
    }

`;

class ArableFarmForm extends Component {

    state = {
        name: "",
        size: "",
        sizeUnit: "hectares",
        seedCost: "",
        fertiliserCost: "",
        limeCost: "",
        sprayCost: "",
        cultivationCost: "",
        licenceCost: "",
        validationErrors: {},
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    validate(input) {

        let validationErrors = {};
        let isError = false;

        if(!input.name || (input.name === "")) {

            isError=true;
            validationErrors.name = "A Farm Name is required."

        }

        if(!input.size || (input.size === "")) {
            
            isError=true;
            validationErrors.size = "A Farm Size is required."

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

        const acresPerHectare = 2.4710538146717;
        let input = {
            name:                   this.state.name,
            size:                   this.state.sizeUnit === "acres" ? (this.state.size * acresPerHectare) : this.state.size,
            seedCost:               this.state.seedCost,
            fertiliserCost:         this.state.fertiliserCost,
            limeCost:               this.state.limeCost,
            sprayCost:              this.state.sprayCost,
            cultivationCost:        this.state.cultivationCost,
            licenceCost:            this.state.licenceCost,
        }

        let isError = this.validate(input);
        console.log(isError)

        if(!isError) {
            this.props.onAdd({input}).then(response => {
                this.props.history.replace("/arable");
            });
        }

        console.log(input);
        console.log(this.state);
    }

    render() {

        const loaded = true;

        const { 
            name, 
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

        console.log("validationErrors")
        console.log(validationErrors)

        return (
            <Dashboard sidebar={<Sidebar />}>

                {!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} size={50} /> : null}

                <Grow in={loaded}>
                    <Paper className="offset-md-2 col-md-8 offset-lg-4 col-lg-4">
                        <div className="card-body">
                            <h3 className="card-title">Create a New Farm</h3>
                            <hr />
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <h5>Basic Info</h5>
                                        <div className="form-group">
                                            <TextField
                                                name="name"
                                                type="text"
                                                label="Farm Name"
                                                fullWidth
                                                value={name}
                                                onChange={this.handleChange.bind(this)}
                                                helperText={validationErrors.name}
                                                error={validationErrors.name ? true:false}
                                                required
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <TextField
                                                        name="size"
                                                        type="number"
                                                        label="Farm Size"
                                                        value={size}
                                                        onChange={this.handleChange.bind(this)}
                                                        helperText={validationErrors.size}
                                                        error={validationErrors.size ? true:false}
                                                        fullWidth
                                                        required
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
                                                helperText={"This is the total cost spent on seed for all areas in production"}
                                                focused={true}
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
export default graphql(createFarm, {
	props: props => ({
		onAdd: farm => props.mutate({
            variables: farm
        })
	})
}

)(ArableFarmForm);