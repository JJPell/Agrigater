import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import FontAwesome from 'react-fontawesome';
import _ from "lodash";

import Dashboard from "../layout/Dashboard";

import PropTypes from 'prop-types';
import { Paper, Button, Grow, CircularProgress } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";

import { isAuthenticated, isToken } from "../../Auth";

import numberal from "numeral";
const NUMBER_FORMAT = '0,0.00';


const styles = theme => ({
	root: {
	  ...theme.mixins.gutters(),
	  paddingTop: theme.spacing.unit * 2,
	  paddingBottom: theme.spacing.unit * 2,
	},
  });

class Report extends Component {

	listAnimalTypes(listAnimals) {

		let types = [];

		listAnimals.forEach(animal => {

			if(types.indexOf(animal.type.name) < 0) {

				types.push(animal.type.name);

			}

		});

		return types;

	}

	render() {

		const { classes } = this.props;

		console.log(this.props)

		let lands = this.props.farms ? this.props.farms : [];
		const animals = this.props.animals ? this.props.animals : [];
		const animalTypes = animals ? this.listAnimalTypes(animals) : [];
		const listStock = this.props.stock ? this.props.stock : [];

		let arableTotalValue = 0;
		let livestockTotalValue = 0;
		let stockTotalValue = 0;

		//const loaded = !this.props.listFarms.loading && !this.props.listAnimals.loading && !this.props.listStock.loading;

		return (

			<div className="card-body">
				<h3 className="h3 font-weight-bold">Valuation Report</h3>
				<hr />
				<h5 className="font-weight-bold">Work in Progress to Growing Crops</h5>
				<p>The following if a breakdown of all growing crops and the work that has been put in to get to this stage.</p>
				<br />
				{lands.map(land => {

					arableTotalValue += land.costTotal;

					return <div key={land.id} className="page-break-avoid">


						<h6 className="font-weight-bold">{land.name}</h6>
						<p>{land.name} is {land.size} hectares or {(land.size * window.acresInHectare).toFixed(0)} acres in size.</p>
	
						<table className="table table-responsize">
							<tbody>
								<tr>
									<td className="col-6">Seed</td>
									<td className="col-6 text-right">£{numberal(land.seedCostTotal).format(NUMBER_FORMAT)}</td>
								</tr>
								<tr>
									<td className="col-6">Fertiliser</td>
									<td className="col-6 text-right">£{numberal(land.fertiliserCostTotal).format(NUMBER_FORMAT)}</td>
								</tr>
								<tr>
									<td className="col-6">Lime</td>
									<td className="col-6 text-right">£{numberal(land.limeCostTotal).format(NUMBER_FORMAT)}</td>
								</tr>
								<tr>
									<td className="col-6">Sprays</td>
									<td className="col-6 text-right">£{numberal(land.sprayCostTotal).format(NUMBER_FORMAT)}</td>
								</tr>
								<tr>
									<td className="col-6">Cultivations</td>
									<td className="col-6 text-right">£{numberal(land.cultivationCostTotal).format(NUMBER_FORMAT)}</td>
								</tr>
								<tr>
									<td className="col-6">Licence Fees</td>
									<td className="col-6 text-right">£{numberal(land.licenceCostTotal).format(NUMBER_FORMAT)}</td>
								</tr>
							</tbody>
							<tfoot>
								<tr>
									<th className="col-6"></th>
									<th className="col-6 text-right">£{numberal(land.costTotal).format(NUMBER_FORMAT)}</th>
								</tr>
							</tfoot>
						</table>
						<br />

					</div>

				})}
				<table className="table table-responsize page-break-avoid">
					<tfoot>
						<tr>
							<th className="col-6"></th>
							<th className="col-6">£{numberal(arableTotalValue).format(NUMBER_FORMAT)}</th>
						</tr>
					</tfoot>
				</table>
				<div className="page-break-avoid">
				<h5 className="font-weight-bold">Livestock</h5>
				<p>The following is a breakdown of all livestock and their associated value.</p>
				<br />
				{animalTypes.map(animalTypeName => {


					

					return <div key={animalTypeName} className="page-break-avoid">

						<h6 className="font-weight-bold">{_.startCase(animalTypeName)}</h6>
						<table className="table table-responsize">
							<tbody>
								
								{animals.map(animal => {

									if(animal.type.name === animalTypeName) {

									livestockTotalValue += (animal.quantity*animal.value);

									return 	<tr key={animal.id}>
												<td className="col-6">{animal.quantity}x {_.startCase(animal.breed.name) + " " +_.startCase(animal.gender.name) + (animal.quantity > 1 ? "s" : "")}</td>
												<td className="col-6 text-right">£{numberal(animal.quantity*animal.value).format(NUMBER_FORMAT)}</td>
											</tr>

									}

								})}
							</tbody>
							<tfoot>
								<tr>
									<th className="col-6"></th>
									<th className="col-6 text-right">£{numberal(livestockTotalValue).format(NUMBER_FORMAT)}</th>
								</tr>
							</tfoot>
						</table>
						<br />

					</div>

					})}
				</div>
				<div className="page-break-avoid">
					<h5 className="font-weight-bold">Stock</h5>
					<p>The following is a breakdown of all stock, quantity and associated value.</p>
					<br />


					<div className="page-break-avoid">
						<table className="table table-responsize page-break-avoid">
							<tbody>
								{listStock.map(stock => {

									stockTotalValue += (stock.value * stock.quantity);

									return 	<tr key={stock.id}>
												<td className="col-6">{stock.quantity}x {_.startCase(stock.name)}</td>
												<td className="col-6 text-right">£{numberal(stock.value * stock.quantity).format(NUMBER_FORMAT)}</td>
											</tr>

									

								})}
							</tbody>
							<tfoot>
								<tr>
									<th className="col-6"></th>
									<th className="col-6 text-right">£{numberal(stockTotalValue).format(NUMBER_FORMAT)}</th>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
				<br />
				<table className="table table-responsize">
					<tfoot>
						<tr>
							<th className="col-6">Total Valuation</th>
							<th className="col-6 text-right">£{numberal(arableTotalValue + livestockTotalValue + stockTotalValue).format(NUMBER_FORMAT)}</th>
						</tr>
					</tfoot>
				</table>
			</div>

		);
	}
}

export default withStyles(styles)(Report);
