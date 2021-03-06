import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Dashboard from "../layout/Dashboard";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Button, Fade, CircularProgress } from "@material-ui/core";
import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";
import Sidebar from "./ArableSidebar";
import { isAuthenticated, isToken } from "../../Auth";


class Arable extends Component {

	constructor () {
		super();
		this.state = {
			showDialog: false,
			selectedLand: null
		};

	}

	componentWillMount() {
		isToken(this);
	}
	
	handleOpenDialog (land) {
		this.setState({ 
			showDialog: true, 
			selectedLand: land
		});
	}
	
	handleCloseDialog () {
		this.setState({ 
			showDialog: false,
			selectedLand: null
		});
	}

	deleteLand = ({id}) => {

		this.props.mutate({
			variables: { id }
		});

		this.handleCloseDialog()

		this.props.data.refetch();


	}

	render() {

		isAuthenticated(this);

		let tableData = this.props.data.listFarms || [];
		const { fullScreen } = this.props;

		const loaded = !this.props.data.loading;
		return (
			<Dashboard sidebar={<Sidebar />}>

				{!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} size={50} /> : null}

				<Fade in={loaded}>
					<div className="card">

						<div className="card-body">
							<h3 className="card-title">Arable</h3>
							<hr />
						</div>

							<ReactTable
								columns={[
									{
									Header: "Arable",
									columns: [
										{
										Header: "Name",
										accessor: "name"
										},
										{
										Header: "Size",
										accessor: "size"
										},
										{
										Header: "Seed Cost",
										accessor: "seedCost"
										},
										{
										Header: "Fertiliser Cost",
										accessor: "fertiliserCost"
										},
										{
										Header: "Lime Cost",
										accessor: "limeCost"
										},
										{
										Header: "Spray Cost",
										accessor: "sprayCost"
										},
										{
										Header: "Cultivation Cost",
										accessor: "cultivationCost"
										},
										{
										Header: "Licence Cost",
										accessor: "licenceCost"
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
								data={ tableData.map((prop,key) => {
									return ({
										...prop,
										actions: (
											<div className="d-flex justify-content-center">
												<Link to={"arable/"+prop["id"]} ><Button color="default" variant="contained">Detail</Button></Link>
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
						Are you sure you want to delete this farm{ this.state.selectedLand ? `"${this.state.selectedLand.name}"` : ""}?
						This will also delete any fields or jobs associated with this farm.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => this.handleCloseDialog()} color="primary">
						No
						</Button>
						<Button onClick={() => this.deleteLand(this.state.selectedLand)} color="primary" autoFocus>
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
			listFarms {
				id
				name
				size
				seedCost
				fertiliserCost
				limeCost
				sprayCost
				cultivationCost
				licenceCost
				fields {
					name
				}
			}
		}
	
	`, {
		options: {
			fetchPolicy: "cache-and-network"
		}
	}),
	graphql(gql`

		mutation deleteLand($id: ID!) {
			deleteLand(id: $id)
		}
		
	`, {
		options: {
			fetchPolicy: "cache-and-network"
		}
	})
)(Arable);
