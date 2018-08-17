import React, { Component } from 'react';
import Select from 'react-select'

import { Button, Paper, TextField, MenuItem, Grow, CircularProgress } from "@material-ui/core";

import _ from "lodash";

import Dashboard from "../layout/Dashboard";

import { compose, graphql } from "react-apollo";
import listAnimalTypes from "../../queries/listAnimalTypes";
import createAnimal from "../../mutations/createAnimal";

import Sidebar from "./LivestockSidebar";

class LivestockForm extends Component {

    state = {
        animal: "",
        quantity: ""
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChangeSelect({value}) {
        this.setState({ animal: value });
    }

    addAnimal(event) {

        console.log(this.state);
        this.props.createAnimal({
            breed: this.state.animal,
            quantity : this.state.quantity
        }).then(response => {
            this.props.history.replace("/livestock");
        });

    }

    render() {

        let groupedOptions = [];

        if(this.props.data.listAnimalTypes) {

            this.props.data.listAnimalTypes.forEach((animalTypes) => {

                let options = [];

                animalTypes.breeds.forEach((breed) => {

                    options.push({
                        value: breed.id,
                        label: _.startCase(breed.name)
                    });

                });

                groupedOptions.push({
                    label: animalTypes.name,
                    options
                })

            });

        }

        const groupStyles = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        };
        const groupBadgeStyles = {
            backgroundColor: '#EBECF0',
            borderRadius: '2em',
            color: '#172B4D',
            display: 'inline-block',
            fontSize: 12,
            fontWeight: 'normal',
            lineHeight: '1',
            minWidth: 1,
            padding: '0.16666666666667em 0.5em',
            textAlign: 'center',
        };

        const formatGroupLabel = data => (
            <div style={groupStyles}>
                <span>{data.label}</span>
                <span style={groupBadgeStyles}>{data.options.length}</span>
            </div>
        );
        
        console.log(this.props)

        const { animal, quantity } = this.state;
        const loaded = !this.props.data.loading;

        return (
            <Dashboard sidebar={<Sidebar />}>

                {!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} size={50} /> : null}

                <Grow in={loaded}>
                    <Paper className="offset-md-2 col-md-8 offset-lg-3 col-lg-6">
                        <div className="card-body">
                            <h3 className="card-title">Add New Animal</h3>
                            <hr />
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label>Animal</label>
                                    <Select
                                        name="animal"
                                        options={groupedOptions}
                                        formatGroupLabel={formatGroupLabel}
                                        onChange={this.handleChangeSelect.bind(this)}
                                    />

                                </div>
                                <div className="form-group">
                                    <TextField
                                        type="number"
                                        fullWidth
                                        name="quantity"
                                        label="Animal Quantity"
                                        value={quantity}
                                        onChange={this.handleChange.bind(this)}
                                    />
                                </div>
                                <Button variant="contained" color="primary" onClick={this.addAnimal.bind(this)}>Submit</Button>
                            </form>
                        </div>
                    </Paper>
                </Grow>
            </Dashboard>
        );
    }
}


export default compose(
    graphql(listAnimalTypes),
    graphql(createAnimal, {
        props: props => ({
            createAnimal: animal => props.mutate({
                variables: animal
            })
        })
    })
)(LivestockForm);
