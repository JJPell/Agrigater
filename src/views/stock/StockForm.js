import React, { Component } from 'react';

import _ from "lodash";

import Dashboard from "../layout/Dashboard";

import { compose, graphql } from "react-apollo";
import listStockTypes from '../../queries/listStockTypes';
import createStock from "../../mutations/createStock";

import { sidebarLinks } from "./sidebar";


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

        return (
            <Dashboard sidebar={sidebarLinks}>
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title">Add New Stock</h3>
                    <hr />
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label>Stock</label>
                            <select key={this.props.data.loading ? 'notLoadedYet' : 'loaded'} name="stockType" className="form-control" value={stockType} onChange={this.handleChange.bind(this)}>
                                {listStockTypes.map(function(stockType) {
                                    return <option key={stockType.id} value={stockType.id}>{_.startCase(stockType.name)}</option>;
                                })}
                            </select>

                        </div>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input name="quantity" type="number" className="form-control" placeholder="Quantity" value={quantity} onChange={this.handleChange.bind(this)}/>
                        </div>
                        <button className="btn btn-primary" type="button" onClick={this.addStock.bind(this)}>Submit</button>
                    </form>
                </div>
            </div>
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
