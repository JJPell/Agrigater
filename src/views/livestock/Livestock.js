import React, { Component } from 'react';
import _ from "lodash";
import Dashboard from "../layout/Dashboard";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Fade, CircularProgress } from "@material-ui/core";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { compose, graphql } from "react-apollo";
import Sidebar from "./LivestockSidebar";
import { isAuthenticated, isToken } from "../../Auth";
import gql from "graphql-tag";


class Livestock extends Component {

	constructor () {
		super();
		this.state = {
			showDialog: false,
			selectedAnimal: null
		};

	}
	
	componentWillMount() {
		isToken(this);
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
		
		isAuthenticated(this);
		let tableData = this.props.data.listAnimals || [];
		const { fullScreen } = this.props;

		const loaded = !this.props.data.loading;
		return (
			<Dashboard sidebar={<Sidebar />} history={this.props.history}>

				{!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} size={50} /> : null}

				<Fade in={loaded}>
					<div className="card">

						<div className="card-body">
							<h3 className="card-title">Livestock</h3>
							<hr />
						</div>

							<ReactTable
								columns={[
									{
									Header: "Livestock",
									columns: [
										{
											Header: "Type",
											headerClassName: "text-left",
											accessor: "name",
											Cell: row => {
												console.log("name", row)
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


export default compose(
	graphql(gql`
		query {
			listAnimals {
				id
				name
				quantity
				value
				type {
					type
					gender
					breed
				}
			}
		}
	`, {
		options: {
			fetchPolicy: "cache-and-network"
		}
	}),
	graphql(gql`
		mutation deleteAnimal($id: ID!) {
			deleteAnimal(id: $id)
		}
	`, {
		options: {
			fetchPolicy: "cache-and-network"
		}
	})
)(Livestock);
