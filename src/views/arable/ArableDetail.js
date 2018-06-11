import React, { Component } from 'react';

import Dashboard from "../layout/Dashboard";

import ReactTable from "react-table";
import "react-table/react-table.css";

import { graphql } from "react-apollo";
import getLand from "../../queries/getLand";

const sidebarLinks = ({ match }) => ([{
    name: "Add Arable Area",
    icon: "add",
    href: match.url+"/arable/add"
}]);

class ArableDetail extends Component {

    constructor() {
        super();
    }


    render() {

        let land = this.props.data.getLand ? this.props.data.getLand : {};

        console.log(this.props)
        return (
            <Dashboard >
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
                    data={land.jobs || []}
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
                            }
                        ]
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
            </div>
            </Dashboard>
        );
    }
}

export default graphql(getLand, {
        options: (ownProps) => ({
            fetchPolicy: "cache-and-network",
            variables: { 
                id: ownProps.match.params.id 
            } 
        })
    })(ArableDetail);
