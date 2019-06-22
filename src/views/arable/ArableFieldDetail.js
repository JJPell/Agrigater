import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Dashboard from "../layout/Dashboard";
import ReactTable from "react-table";
import "react-table/react-table.css";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Grow, CircularProgress } from "@material-ui/core";
import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";
import Sidebar from "./ArableSidebar";
import { isAuthenticated, isToken } from "../../Auth";


class ArableFieldDetail extends Component {

    constructor() {
        super();
        this.state = {
			showDialog: false,
			selectedJob: null
        };
        
    }
    
	componentWillMount() {
		isToken(this);
	}

    handleOpenDialog (job) {
		this.setState({ 
			showDialog: true, 
			selectedJob: job
        });
	}
	
	handleCloseDialog () {
		this.setState({ 
			showDialog: false,
			selectedJob: null
		});
	}

	deleteJob = ({id}) => {

		this.props.mutate({
			variables: { id }
		});

		this.handleCloseDialog()

		this.props.data.refetch();

	}

    render() {
        
		isAuthenticated(this);

        let field = this.props.data.getField ? this.props.data.getField : {};
        let jobs = field.jobs || [];

        const { fullScreen } = this.props;

        const loaded = !this.props.data.loading;

        return (
            <Dashboard sidebar={<Sidebar />} history={this.props.history}>

                {!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}}  size={50} /> : null}
                <div className="row">
                    <Grow in={loaded}>
                        <div className="col-lg-4 col-md-4 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">{field.name} Detail</h3>
                                </div>
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>Size</th>
                                            <td>{field.size || "Unknown"}</td>
                                        </tr>
                                        <tr>
                                            <th>Seed Cost</th>
                                            <td>{field.seedCost ? field.seedCost.toFixed(2) : "0.00"}</td>
                                        </tr>
                                        <tr>
                                            <th>Fertiliser Cost</th>
                                            <td>{field.fertiliserCost ? field.fertiliserCost.toFixed(2) : "0.00"}</td>
                                        </tr>
                                        <tr>
                                            <th>Lime Cost</th>
                                            <td>{field.limeCost ? field.limeCost.toFixed(2) : "0.00"}</td>
                                        </tr>
                                        <tr>
                                            <th>Spray Cost</th>
                                            <td>{field.sprayCost ? field.sprayCost.toFixed(2) : "0.00"}</td>
                                        </tr>
                                        <tr>
                                            <th>Cultivation Cost</th>
                                            <td>{field.cultivationCost ? field.cultivationCost.toFixed(2) : "0.00"}</td>
                                        </tr>
                                        <tr>
                                            <th>Licence Cost</th>
                                            <td>{field.licenceCost ? field.licenceCost.toFixed(2) : "0.00"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Grow>
                    <Grow in={loaded}>
                        <div className="col-lg-8 col-md-8 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">{field.name} Jobs</h3>
                                </div>
                                <ReactTable
                                    data={ jobs.map((prop,key) => {
                                        return ({
                                            ...prop,
                                            actions: (
                                                <div className="d-flex justify-content-center">
                                                    <Link to={"field/"+prop["id"]} ><Button color="default" variant="contained">Detail</Button></Link>
                                                    <Button className="ml-1 bg-danger" variant="contained" onClick={() => this.handleOpenDialog(prop)}>Delete</Button>
                                                </div>
                                            ) 
                                        })
                                    })}
                                    columns={[
                                        {
                                            columns: [
                                                {
                                                    Header: "Type",
                                                    accessor: "type.name"
                                                },
                                                {
                                                    Header: "Date",
                                                    accessor: "date"
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
                        </div>
                    </Grow>
                </div>
                <Dialog
					fullScreen={fullScreen}
					open={this.state.showDialog}
					onClose={this.handleCloseDialog}
					aria-labelledby="responsive-dialog-title"
					>
					<DialogTitle id="responsive-dialog-title">{"Confirm Delete"}</DialogTitle>
					<DialogContent>
						<DialogContentText>
						Are you sure you want to delete this field?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => this.handleCloseDialog()} color="primary">
						No
						</Button>
						<Button onClick={() => this.deleteJob(this.state.selectedJob)} color="primary" autoFocus>
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
    
        query getField(
            $id: ID!
        ) {
            getField(
                id: $id
            ) {
                id
                name
                size
                seedCost
                fertiliserCost
                limeCost
                sprayCost
                cultivationCost
                licenceCost
                farm {
                    id
                    name
                    size
                }
                jobs {
                    id
                    date
                    type {
                        name
                    }
                }
            }
            
        }
    
    `, {
        options: (ownProps) => ({
            fetchPolicy: "cache-and-network",
            variables: { 
                id: ownProps.match.params.id 
            } 
        })
    }),
    graphql(gql`
        mutation deleteJob(
            $id: ID!
        ) {
            deleteJob(id: $id)
        }
    `, {
    })
)(ArableFieldDetail);
