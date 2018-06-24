import React, { Component } from 'react';
import { Link } from "react-router-dom";
import FontAwesome from 'react-fontawesome';
import _ from "lodash";

import Dashboard from "../layout/Dashboard";
import BootstrapTable from 'react-bootstrap-table-next';

import Modal from 'react-modal';
import ReactTable from "react-table";
import "react-table/react-table.css";

import { compose, graphql } from "react-apollo";

import listAnimals from "../../queries/listAnimals";
import deleteAnimal from "../../mutations/deleteAnimal";

import { sidebarLinks } from "./sidebar";

Modal.setAppElement('#root');

const modalStyles = {
	content : {
	  top                   : '50%',
	  left                  : '50%',
	  right                 : 'auto',
	  bottom                : 'auto',
	  marginRight           : '-50%',
	  transform             : 'translate(-50%, -50%)',
	  border:	0,
	  backgroundColor: "transparent"
	}
};

class Livestock extends Component {

	constructor () {
		super();
		this.state = {
			showModal: false,
			selectedAnimal: null
		};
		
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
	}
	
	handleOpenModal (land) {
		this.setState({ 
			showModal: true, 
			selectedAnimal: land
		});
	}
	
	handleCloseModal () {
		this.setState({ 
			showModal: false,
			selectedAnimal: null
		});
	}

	deleteAnimal = ({id}) => {

		this.props.mutate({
			variables: { id }
		});

		this.handleCloseModal()

		this.props.data.refetch();


	}

	render() {
		let tableData = this.props.data.listAnimals || [];
		return (
			<Dashboard sidebar={sidebarLinks}>
			
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
										Header: "ID",
										accessor: "id"
									},
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
										<div className="btn-group w-100 m-0" role="group">
										
										<Link to={"arable/"+prop["id"]} className="btn btn-primary btn-outline-primary w-50 m-0"><FontAwesome name={"info-circle"} /> Edit</Link>
										
										<a href="#" onClick={() => this.handleOpenModal(prop)} className="btn btn-danger btn-outline-danger w-50 m-0"><FontAwesome name={"trash"} /> Delete</a>
										
										</div>
									) 
								})
							})}
						/>

				</div>
				<Modal 
				isOpen={this.state.showModal}
				contentLabel="onRequestClose Example"
				onRequestClose={this.handleCloseModal}
				shouldCloseOnOverlayClick={true}
				style={modalStyles}
				>

					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title text-danger">Caution</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCloseModal}>
								<span aria-hidden="true">×</span>
								</button>
							</div>
							<div className="modal-body">
								<p>Are you sure you want to delete { this.state.selectedAnimal ? this.state.selectedAnimal.quantity : "this" } { this.state.selectedAnimal ? this.state.selectedAnimal.breed.name : "" } { this.state.selectedAnimal ? this.state.selectedAnimal.type.name : "" }?</p>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-danger" onClick={() => this.deleteAnimal(this.state.selectedAnimal)}>Yes</button>
								<button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.handleCloseModal}>No</button>
							</div>
						</div>
					</div>

				</Modal>


			</Dashboard>
		);
	}
}


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
