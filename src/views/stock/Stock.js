import React, { Component } from 'react';
import { Link } from "react-router-dom";
import FontAwesome from 'react-fontawesome';
import _ from "lodash";

import Dashboard from "../layout/Dashboard";

import Modal from 'react-modal';
import ReactTable from "react-table";
import "react-table/react-table.css";

import { compose, graphql } from "react-apollo";

import listStock from "../../queries/listStock";
import deleteStock from "../../mutations/deleteStock";

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

class Stock extends Component {

	constructor () {
		super();
		this.state = {
			showModal: false,
			selectedStock: null
		};
		
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
	}
	
	handleOpenModal (stock) {
		this.setState({ 
			showModal: true, 
			selectedStock: stock
		});
	}
	
	handleCloseModal () {
		this.setState({ 
			showModal: false,
			selectedStock: null
		});
	}

	deleteStock = ({id}) => {

		this.props.mutate({
			variables: { id }
		});

		this.handleCloseModal()

		this.props.data.refetch();


	}

	render() {
		let tableData = this.props.data.listStock || [];
		return (
			<Dashboard sidebar={sidebarLinks}>
			
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
										Header: "ID",
										accessor: "id"
									},
									{
										Header: "Name",
										accessor: "name",
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
										
										<a href="#" onClick={() => this.handleOpenModal(prop)} className="btn btn-danger btn-outline-danger w-50 ml-auto"><FontAwesome name={"trash"} /> Delete</a>
										
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
								<p>Are you sure you want to delete { this.state.selectedStock ? this.state.selectedStock.quantity : "this" } { this.state.selectedStock ? this.state.selectedStock.name : "" } { this.state.selectedStock ? this.state.selectedStock.name : "" }?</p>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-danger" onClick={() => this.deleteStock(this.state.selectedStock)}>Yes</button>
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
