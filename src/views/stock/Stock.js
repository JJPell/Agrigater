import React, { Component } from 'react';
import { Link } from "react-router-dom";
import FontAwesome from 'react-fontawesome';
import _ from "lodash";

import Dashboard from "../layout/Dashboard";

import ReactTable from "react-table";
import "react-table/react-table.css";

import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import { Button, Paper, Fade, CircularProgress } from "@material-ui/core";

import { compose, graphql } from "react-apollo";

import listStock from "../../queries/listStock";
import deleteStock from "../../mutations/deleteStock";

import Sidebar from "./StockSidebar";

import { isAuthenticated, isToken } from "../../Auth";


class Stock extends Component {

	constructor () {
		super();
		this.state = {
			showDialog: false,
			selectedStock: null
		};

	}
	
	componentWillMount() {
		isToken(this);
	}
	
	handleOpenDialog (stock) {
		this.setState({ 
			showDialog: true, 
			selectedStock: stock
		});
	}
	
	handleCloseDialog () {
		this.setState({ 
			showDialog: false,
			selectedStock: null
		});
	}

	deleteStock = ({id}) => {

		this.props.mutate({
			variables: { id }
		});

		this.handleCloseDialog()

		this.props.data.refetch();


	}

	render() {
		
		isAuthenticated(this);
		let tableData = this.props.data.listStock || [];
		const { fullScreen } = this.props;

		const loaded = !this.props.data.loading;
		return (
			<Dashboard sidebar={<Sidebar />} history={this.props.history}>
			
				{!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} size={50} /> : null}

				<Fade in={loaded}>
					<div className="card">

						<div className="card-body">
							<h3 className="card-title">Stock</h3>
							<hr />
						</div>

							{/* <BootstrapTable keyField='id' data={ this.props.tableData } columns={ columns } selectRow={ selectRow } hover/> */}

							<ReactTable
								columns={[
									{
									Header: "Stock Table",
									columns: [
										{
											Header: "Name",
											headerClassName: "text-left",
											accessor: "name",
											Cell: row => {
												return _.startCase(row.value);
											}
										},
										{
											Header: "Quantity",
											headerClassName: "text-left",
											accessor: "quantity"
										},
										{
											Header: "Actions",
											accessor: "actions",
											sortable: false,
											filterable: false,
										}
									]
									}
								]}
								defaultPageSize={10}
								className="-striped -highlight"
								// data={this.props.tableData}
								data={ tableData.map((prop,key) => {
									return ({
										...prop,
										actions: (
											<div className="d-flex justify-content-center">
												<Button className="ml-1 bg-danger" variant="contained" onClick={() => this.handleOpenDialog(prop)}>Delete</Button>
											</div>
										) 
									})
								})}
							/>

					</div>
				</Fade>
				<Dialog
					fullScreen={fullScreen}
					open={this.state.showDialog}
					onClose={this.handleCloseDialog}
					aria-labelledby="responsive-dialog-title"
					>
					<DialogTitle id="responsive-dialog-title">{"Confirm Delete"}</DialogTitle>
					<DialogContent>
						<DialogContentText>
						Are you sure you want to delete { this.state.selectedStock ? this.state.selectedStock.quantity : "this" } { this.state.selectedStock ? this.state.selectedStock.name : "" } { this.state.selectedStock ? this.state.selectedStock.name : "" }?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => this.handleCloseDialog()} color="primary">
						No
						</Button>
						<Button onClick={() => this.deleteStock(this.state.selectedStock)} color="primary" autoFocus>
						Yes
						</Button>
					</DialogActions>
				</Dialog>

			</Dashboard>
		);
	}
}


export default compose(
	graphql(listStock, {
		options: {
			fetchPolicy: "cache-and-network"
		}
	}),
	graphql(deleteStock, {
		options: {
			fetchPolicy: "cache-and-network"
		}
	})
)(Stock);
