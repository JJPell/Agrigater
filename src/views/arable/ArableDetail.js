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


class ArableDetail extends Component {

    constructor() {
        super();
        this.state = {
			showDialog: false,
			selected: null
        };
    }
    
	componentWillMount() {
		isToken(this);
	}

    handleOpenDialog (fieldOrJob) {
		this.setState({ 
			showDialog: true, 
			selected: fieldOrJob
        });
	}
	
	handleCloseDialog () {
		this.setState({ 
			showDialog: false,
			selected: null
		});
	}

	deleteJob = ({id}) => {

		this.props.deleteJob({
			variables: { id }
		});

		this.handleCloseDialog()

		this.props.data.refetch();

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

        let farm = this.props.data.getFarm ? this.props.data.getFarm : {};
        let fields = farm.fields || [];
        let jobs = farm.jobs || [];
        const { fullScreen } = this.props;

        const loaded = !this.props.data.loading;

        const { selected } = this.state;

        return (
            <Dashboard sidebar={<Sidebar />}>

                {!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}}  size={50} /> : null}
                <div className="row">
                    <Grow in={loaded}>
                        <div className="col-lg-2 col-md-6 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">{farm.name} Detail</h3>
                                </div>
                                <table className="table">
                                    <tr>
                                        <th>Size</th>
                                        <td>{farm.size || "Unknown"}</td>
                                    </tr>
                                    <tr>
                                        <th>Seed Cost</th>
                                        <td>{farm.seedCost ? farm.seedCost.toFixed(2) : "0.00"}</td>
                                    </tr>
                                    <tr>
                                        <th>Fertiliser Cost</th>
                                        <td>{farm.fertiliserCost ? farm.fertiliserCost.toFixed(2) : "0.00"}</td>
                                    </tr>
                                    <tr>
                                        <th>Lime Cost</th>
                                        <td>{farm.limeCost ? farm.limeCost.toFixed(2) : "0.00"}</td>
                                    </tr>
                                    <tr>
                                        <th>Spray Cost</th>
                                        <td>{farm.sprayCost ? farm.sprayCost.toFixed(2) : "0.00"}</td>
                                    </tr>
                                    <tr>
                                        <th>Cultivation Cost</th>
                                        <td>{farm.cultivationCost ? farm.cultivationCost.toFixed(2) : "0.00"}</td>
                                    </tr>
                                    <tr>
                                        <th>Licence Cost</th>
                                        <td>{farm.licenceCost ? farm.licenceCost.toFixed(2) : "0.00"}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </Grow>
                    <Grow in={loaded}>
                        <div className="col-lg-5 col-md-6 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">{farm.name} Fields</h3>
                                </div>
                                <ReactTable
                                    data={ fields.map((prop,key) => {
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
                                                    Header: "Name",
                                                    accessor: "name"
                                                },
                                                {
                                                    Header: "Size",
                                                    accessor: "size",
                                                    Cell: row => row.value.toFixed(2)
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
                    <Grow in={loaded}>
                        <div className="col-lg-5 col-md-6 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">{farm.name} Jobs</h3>
                                </div>
                                <ReactTable
                                    data={ jobs.map(prop => {
                                        return ({
                                            ...prop,
                                            actions: (
                                                <div className="d-flex justify-content-center">
                                                    <Button className="bg-danger" variant="contained" onClick={() => this.handleOpenDialog(prop)}>Delete</Button>
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
						Are you sure you want to delete this?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => this.handleCloseDialog()} color="primary">
						No
						</Button>
						<Button onClick={(selected && selected.date) ? (() => this.deleteJob(selected)) : (() => this.deleteField(selected))} color="primary" autoFocus>
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
    
        query getFarm(
            $id: ID!
        ) {
            getFarm(
                id: $id
            ){
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
        name: "deleteJob"
    }),
    graphql(gql`
        mutation deleteLand($id: ID!) {
            deleteLand(id: $id)
        }
    `, {
    }, {
        name: "deleteLand"
    })
)(ArableDetail);
