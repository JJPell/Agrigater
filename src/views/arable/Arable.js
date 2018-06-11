import React, { Component } from 'react';
import { Link } from "react-router-dom";
import FontAwesome from 'react-fontawesome';

import Dashboard from "../layout/Dashboard";
import BootstrapTable from 'react-bootstrap-table-next';

import ReactTable from "react-table";
import "react-table/react-table.css";

import { compose, graphql } from "react-apollo";
import listLands from "../../queries/listLands";

import { sidebarLinks } from "./sidebar";


class Arable extends Component {

  render() {
	let tableData = this.props.data.listLands || [];
    return (
		<Dashboard sidebar={sidebarLinks}>
		
			<div className="card">

				<div className="card-body">
					<h3 className="card-title">Arable</h3>
					<hr />
				</div>

					{/* <BootstrapTable keyField='id' data={ this.props.tableData } columns={ columns } selectRow={ selectRow } hover/> */}

					<ReactTable
						columns={[
							{
							Header: "Arable",
							columns: [
								{
									Header: "ID",
									accessor: "id"
								},
								{
								Header: "Name",
								accessor: "name"
								},
								{
								Header: "Size",
								accessor: "size"
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
									
									<Link to={"arable/"+prop["id"]} className="btn btn-primary btn-outline-primary w-50 m-0"><FontAwesome name={"info-circle"} /> Detail</Link>
									
									<Link  to={"arable/"} className="btn btn-danger btn-outline-danger w-50 m-0"><FontAwesome name={"trash"} /> Delete</Link>
									
									</div>
								) 
							})
						})}
					/>

			</div>

        </Dashboard>
    );
  }
}


export default graphql(listLands, {
	options: {
		fetchPolicy: "cache-and-network"
	}
}

)(Arable);
