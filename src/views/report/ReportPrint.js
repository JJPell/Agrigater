import React, { Component, Fragment } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Link } from 'react-router-dom';
import _ from "lodash";

import Dashboard from "../layout/Dashboard";
import Report from "./Report";

import { Paper, Button, Grow, CircularProgress } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";

import { isAuthenticated, isToken } from "../../Auth";
import ReactPDF from '@react-pdf/renderer';


const styles = theme => ({
	root: {
	  ...theme.mixins.gutters(),
	  paddingTop: theme.spacing.unit * 2,
	  paddingBottom: theme.spacing.unit * 2,
	},
	container: {
		marginTop: "10%",
	}
  });

class ReportPrint extends Component {

	componentWillMount() {
		isToken(this);
	}

	render() {
		

		const { classes } = this.props;

		let farms = this.props.listFarms.listFarms || [];
		const animals = this.props.listAnimals.listAnimals || [];
		const stock = this.props.listStock.listStock || [];

		const loaded = !this.props.listFarms.loading && !this.props.listAnimals.loading && !this.props.listStock.loading;
		isAuthenticated(this).then(() => {
			if(loaded) {
				window.print();
			}
		});

		return (
			
			<div className={this.props.classes.container}>
				{!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} className={classes.progress} size={50} /> : 
				<div className="container">
					<img src="/img/logo/ColorVersion.png" className="img report-logo" />
					<Report farms={farms} animals={animals} stock={stock} />	
				</div>}	
			</div>
		);

	}
}

export default withStyles(styles)(compose(
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
				seedCostTotal
				fertiliserCostTotal
				limeCostTotal
				sprayCostTotal
				cultivationCostTotal
				licenceCostTotal
				costTotal
				fields {
					name
					seedCost
					fertiliserCost
					limeCost
					sprayCost
					cultivationCost
					licenceCost
				}
			}
		}
	
	`, {
		name: "listFarms"
	}),
	graphql(gql`

		query {
			listAnimals {
				id
				quantity
				type {
					name
				}
				breed {
					name
				}
				gender {
					name
				}
				value
			}
		}

	`, {
		name: "listAnimals"
	}),
	graphql(gql`

		query {
			listStock {
				id
				name
				quantity
				value
			}
		}

	`, {
		name: "listStock"
	})
)(ReportPrint));
