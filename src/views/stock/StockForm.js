import React, { Component } from 'react';

import _ from "lodash";

import Dashboard from "../layout/Dashboard";

import { Button, Paper, TextField, MenuItem, Grow, CircularProgress } from "@material-ui/core";

import { compose, graphql } from "react-apollo";
import listStockTypes from '../../queries/listStockTypes';
import createStock from "../../mutations/createStock";

import Sidebar from "./StockSidebar";


class StockForm extends Component {

    state = {
        stockType: "",
        quantity: ""
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    addStock(event) {

        console.log(this.state);
        this.props.createStock({
            typeID: this.state.stockType,
            quantity : this.state.quantity
        }).then(response => {
            this.props.history.replace("/stock");
        });

    }

    componentWillReceiveProps(newProps){
        // Set Initial Values
        if(!newProps.data.loading){
            this.setState({
                stockType: newProps.data.listStockTypes[0].id
            });
        }
    }

    render() {

        const listStockTypes = this.props.data.listStockTypes || [];
        const { stockType, quantity } = this.state;
        const loaded = !this.props.data.loading;
        const { classes } = this.props;

        return (
            <Dashboard sidebar={<Sidebar />}>

                {!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} size={50} /> : null}
                <Grow in={loaded}>
                    <Paper className="offset-md-2 col-md-8 offset-lg-3 col-lg-6">
                        <div className="card-body">
                            <h3 className="card-title">Add New Stock</h3>
                            <hr />
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <TextField
                                    select
                                    fullWidth
                                    name="stockType"
                                    label="Stock"
                                    value={stockType}
                                    onChange={this.handleChange.bind(this)}
                                    >
                                    {listStockTypes.map(stockType => (
                                        <MenuItem key={stockType.id} value={stockType.id}>
                                        {_.startCase(stockType.name)}
                                        </MenuItem>
                                    ))}
                                    </TextField>
                                </div>
                                <div className="form-group">
                                    <TextField
                                        type="number"
                                        fullWidth
                                        name="quantity"
                                        label="Quantity"
                                        value={quantity}
                                        onChange={this.handleChange.bind(this)}
                                    />
                                </div>
                                <Button variant="contained" color="primary" onClick={this.addStock.bind(this)}>Submit</Button>
                            </form>
                        </div>
                    </Paper>
                </Grow>
            </Dashboard>
        );
    }
}


export default compose(
    graphql(listStockTypes),
    graphql(createStock, {
        props: props => ({
            createStock: stock => props.mutate({
                variables: stock
            })
        })
    })
)(StockForm);
