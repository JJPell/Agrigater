import React, { Component } from 'react';

import Dashboard from "../layout/Dashboard";
import FontAwesome from 'react-fontawesome';
import { Link } from "react-router-dom";

import ReactTable from "react-table";
import Modal from 'react-modal';
import "react-table/react-table.css";

import { compose, graphql } from "react-apollo";
import getLand from "../../queries/getLand";
import deleteJob from "../../mutations/deleteJob";

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

class ArableDetail extends Component {

    constructor() {
        super();
        this.state = {
			showModal: false,
			selectedJob: null
        };
        
    }

    handleOpenModal (job) {
		this.setState({ 
			showModal: true, 
			selectedJob: job
        });
	}
	
	handleCloseModal () {
		this.setState({ 
			showModal: false,
			selectedJob: null
		});
	}

	deleteJob = ({id}) => {

		this.props.mutate({
			variables: { id }
		});

		this.handleCloseModal()

		this.props.data.refetch();

	}

    render() {

        let land = this.props.data.getLand ? this.props.data.getLand : {};
        let jobs = land.jobs || [];

        return (
            <Dashboard sidebar={sidebarLinks}>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Arable Detail</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                            <ul className="list-group">
                                <li className="list-group-item list-group-item-action">
                                    <span className="p-2 w-50">
                                        Name:
                                    </span>
                                    <span  className="p-2 w-50">
                                        {land.name}
                                    </span>
                                </li>
                                <li className="list-group-item list-group-item-action">
                                    <span className="p-2 w-50">
                                        Size:
                                    </span>
                                    <span  className="p-2 w-50">
                                        {land.size} Acres
                                    </span>
                                </li>
                            </ul>
                            
                            </div>

                        </div>
                    </div>
                    <ReactTable
                        data={ jobs.map((prop,key) => {
                            return ({
                                ...prop,
                                actions: (
                                    <div className="btn-group w-100 m-0" role="group">
                                    
                                        <a href="#" onClick={() => this.handleOpenModal(prop)} className="btn btn-danger btn-outline-danger w-50 ml-auto"><FontAwesome name={"trash"} /> Delete</a>
                                    
                                    </div>
                                ) 
                            })
                        })}
                        columns={[
                            {
                                Header: "Jobs on this Land",
                                columns: [
                                    {
                                        Header: "Date",
                                        accessor: "date"
                                    },
                                    {
                                        Header: "Type",
                                        accessor: "type.name"
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
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.handleCloseModal()}>
                                <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete { this.state.selectedJob ? `"${this.state.selectedJob.type.name}"` : "this"} job { this.state.selectedJob ? `dated: "${this.state.selectedJob.date}"` : ""}?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={() => this.deleteJob(this.state.selectedJob)}>Yes</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.handleCloseModal()}>No</button>
                            </div>
                        </div>
                    </div>

                </Modal>
            </Dashboard>
            
        );
    }
}

export default compose(
    graphql(getLand, {
        options: (ownProps) => ({
            fetchPolicy: "cache-and-network",
            variables: { 
                id: ownProps.match.params.id 
            } 
        })
    }),
    graphql(deleteJob, {
    })
)(ArableDetail);
