import React, { Component } from 'react';
import { Link } from "react-router-dom";
import FontAwesome from 'react-fontawesome';
import _ from "lodash";

import Dashboard from "../layout/Dashboard";

import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { Button, Paper, Fade, CircularProgress } from "@material-ui/core";

import ReactTable from "react-table";
import "react-table/react-table.css";

import { compose, graphql } from "react-apollo";

import listAnimals from "../../queries/listAnimals";
import deleteAnimal from "../../mutations/deleteAnimal";

import Sidebar from "./LivestockSidebar";

class Livestock extends Component {

	constructor () {
		super();
		this.state = {
			showDialog: false,
			selectedAnimal: null
		};

	}
	
	handleOpenDialog (land) {
		this.setState({ 
			showDialog: true, 
			selectedAnimal: land
		});
	}
	
	handleCloseDialog () {
		this.setState({ 
			showDialog: false,
			selectedAnimal: null
		});
	}

	deleteAnimal = ({id}) => {

		this.props.mutate({
			variables: { id }
		});

		this.handleCloseDialog()

		this.props.data.refetch();


	}

	render() {
		let tableData = this.props.data.listAnimals || [];
		const { fullScreen } = this.props;

		const loaded = !this.props.data.loading;
		return (
			<Dashboard sidebar={<Sidebar />}>

				{!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} size={50} /> : null}

				<Fade in={loaded}>
					<div className="card">

						<div className="card-body">
							<h3 className="card-title">Livestock</h3>
							<hr />
						</div>

							{/* <BootstrapTable keyField='id' data={ this.props.tableData } columns={ columns } selectRow={ selectRow } hover/> */}

							<ReactTable
								columns={[
									{
									Header: "Livestock",
									columns: [
										{
											Header: "Type",
											accessor: "type.name",
											Cell: row => {
												return _.startCase(row.value);
											}
										},
										{
											Header: "Breed",
											accessor: "breed.name",
											Cell: row => {
												return _.startCase(row.value);
											}
										},
										{
											Header: "Gender",
											accessor: "gender.name",
											Cell: row => {
												return _.startCase(row.value);
											}
										},
										{
											Header: "Quantity",
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
												<Button className="bg-danger" variant="contained" onClick={() => this.handleOpenDialog(prop)}>Delete</Button>
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
						Are you sure you want to delete { this.state.selectedAnimal ? this.state.selectedAnimal.quantity : "this" } { this.state.selectedAnimal ? this.state.selectedAnimal.breed.name : "" } { this.state.selectedAnimal ? this.state.selectedAnimal.type.name : "" }?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => this.handleCloseDialog()} color="primary">
						No
						</Button>
						<Button onClick={() => this.deleteAnimal(this.state.selectedAnimal)} color="primary" autoFocus>
						Yes
						</Button>
					</DialogActions>
				</Dialog>

			</Dashboard>
		);
	}
}

Livestock.propTypes = {
	fullScreen: PropTypes.bool.isRequired,
};

export default compose(
	graphql(listAnimals, {
		options: {
			fetchPolicy: "cache-and-network"
		}
	}),
	graphql(deleteAnimal, {
		options: {
			fetchPolicy: "cache-and-network"
		}
	})
)(Livestock);
