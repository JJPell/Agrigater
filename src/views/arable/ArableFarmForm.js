import React, { Component } from 'react';
import Dashboard from "../layout/Dashboard";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import {Button, Paper, TextField, Select, MenuItem, Grow, CircularProgress, OutlinedInput} from '@material-ui/core';
import Sidebar from "./ArableSidebar";
import { isAuthenticated, isToken } from "../../Auth";


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

    componentWillMount() {
		isToken(this);
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

        if(isError) {

            this.setState({
                validationErrors
            });

        }

        return isError;

    }

    addArable(event) {

        let input = {
            name:                   this.state.name,
            size:                   this.state.sizeUnit === "acres" ? (this.state.size / window.acresInHectare) : this.state.size,
            seedCost:               this.state.seedCost ? this.state.seedCost : 0,
            fertiliserCost:         this.state.fertiliserCost ? this.state.fertiliserCost : 0,
            limeCost:               this.state.limeCost ? this.state.limeCost : 0,
            sprayCost:              this.state.sprayCost ? this.state.sprayCost : 0,
            cultivationCost:        this.state.cultivationCost ? this.state.cultivationCost : 0,
            licenceCost:            this.state.licenceCost ? this.state.licenceCost : 0,
        }

        let isError = this.validate(input);

        if(!isError) {
            this.props.onAdd({input}).then(response => {
                this.props.history.replace("/arable");
            });
        }

    }

    render() {
        isAuthenticated(this);

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

        return (
            <Dashboard sidebar={<Sidebar />} history={this.props.history}>

                {!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} size={50} /> : null}

                <Grow in={loaded}>
                    <Paper className="offset-md-2 col-md-8 offset-lg-4 col-lg-4">
                        <div className="card-body">
                            <h3 className="card-title">Create a New Farm</h3>
                            <hr />
                            <form>
                                <div className="row">
                                    <div className="col-sm-12">
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
                                                variant="outlined"
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
                                                        variant="outlined"
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
                                                        fullWidth
                                                        input={
                                                            <OutlinedInput
                                                                name="sizeUnit"
                                                            />
                                                        }
                                                    >
                                                        <MenuItem value={"hectares"}>Hectares</MenuItem>
                                                        <MenuItem value={"acres"}>Acres</MenuItem>
                                                    </Select>
                                                
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h5>Costs</h5>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group">
                                            <TextField
                                                name="seedCost"
                                                type="number"
                                                label="Seed Cost"
                                                value={seedCost}
                                                onChange={this.handleChange.bind(this)}
                                                helperText={"This is the total cost spent on seed for all areas in production"}
                                                focused={true}
                                                variant="outlined"
                                                fullWidth
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group">
                                            <TextField
                                                name="fertiliserCost"
                                                type="number"
                                                label="Fertiliser Cost"
                                                value={fertiliserCost}
                                                onChange={this.handleChange.bind(this)}
                                                variant="outlined"
                                                fullWidth
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group">
                                            <TextField
                                                name="limeCost"
                                                type="number"
                                                label="Lime Cost"
                                                value={limeCost}
                                                onChange={this.handleChange.bind(this)}
                                                variant="outlined"
                                                fullWidth
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group">
                                            <TextField
                                                name="sprayCost"
                                                type="number"
                                                label="Spray Cost"
                                                value={sprayCost}
                                                onChange={this.handleChange.bind(this)}
                                                variant="outlined"
                                                fullWidth
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group">
                                            <TextField
                                                name="cultivationCost"
                                                type="number"
                                                label="Cultivation Cost"
                                                value={cultivationCost}
                                                onChange={this.handleChange.bind(this)}
                                                variant="outlined"
                                                fullWidth
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group">
                                            <TextField
                                                name="licenceCost"
                                                type="number"
                                                label="Licence Cost"
                                                value={licenceCost}
                                                onChange={this.handleChange.bind(this)}
                                                variant="outlined"
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

export default graphql(gql`

        mutation createFarm(
            $input: FarmInput!
        ) {
            createFarm(
                input: $input
            ) {
                id
            }
        }

    `, {
	props: props => ({
		onAdd: farm => props.mutate({
            variables: farm
        })
	})
}

)(ArableFarmForm);