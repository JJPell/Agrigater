import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import FontAwesome from 'react-fontawesome';
import _ from "lodash";

import Dashboard from "../layout/Dashboard";

import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";


class Report extends Component {

	calculateTotal(land) {

		let total = 0;
		if(land.seedCost) {
			total += land.seedCost;
		}
		if(land.fertiserCost) {
			total += land.fertiserCost;
		}
		if(land.limeCost) {
			total += land.limeCost;
		}
		if(land.sprayCost) {
			total += land.sprayCost;
		}
		if(land.cultivationCost) {
			total += land.sprayCost;
		}
		if(land.licenceCost) {
			total += land.sprayCost;
		}

		return total.toFixed(2);

	}

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
		
		const lands = this.props.listLands.listLands || [];
		const animals = this.props.listAnimals.listAnimals || [];
		const animalTypes = animals ? this.listAnimalTypes(animals) : [];
		const listStock = this.props.listStock.listStock || [];

		let arableTotalValue = 0;
		let livestockTotalValue = 0;
		let stockTotalValue = 0;

		console.log(this.props);

		return (
			<Dashboard hideSidebar={true}>
				<br />
				<div className="container">
					<div className="row">
						<div className="ml-auto">
							<button className="btn btn-primary btn-outline">Create as PDF</button>
						</div>
					</div>
				</div>
				<div className="container card">

					<div className="card-body">
						<h3 className="h3 font-weight-bold">Valuation Report</h3>
						<hr />
						<h5 className="font-weight-bold">Work in Progress to Growing Crops</h5>
						<p>The following if a breakdown of all growing crops and the work that has been put in to get to this stage.</p>
						<br />
						{lands.map(land => {

							arableTotalValue += parseFloat(this.calculateTotal(land));

							return <Fragment key={land.id} >


								<h6 className="font-weight-bold">{land.name}</h6>
								<p>{land.name} is {land.size} acres in size.</p>
								<table className="table table-responsize">
									<tbody>
										<tr>
											<td className="col-6">Seed</td>
											<td className="col-6">£{land.seedCost ? land.seedCost.toFixed(2) : "0.00"}</td>
										</tr>
										<tr>
											<td className="col-6">Fertiliser</td>
											<td className="col-6">£{land.fertiserCost ? land.fertiserCost.toFixed(2) : "0.00"}</td>
										</tr>
										<tr>
											<td className="col-6">Lime</td>
											<td className="col-6">£{land.limeCost ? land.limeCost.toFixed(2) : "0.00"}</td>
										</tr>
										<tr>
											<td className="col-6">Sprays</td>
											<td className="col-6">£{land.sprayCost ? land.sprayCost.toFixed(2) : "0.00"}</td>
										</tr>
										<tr>
											<td className="col-6">Cultivations</td>
											<td className="col-6">£{land.cultivationCost ? land.cultivationCost.toFixed(2) : "0.00"}</td>
										</tr>
										<tr>
											<td className="col-6">Licence Fees</td>
											<td className="col-6">£{land.licenceCost ? land.licenceCost.toFixed(2) : "0.00"}</td>
										</tr>
									</tbody>
									<tfoot>
										<tr>
											<th className="col-6"></th>
											<th className="col-6">£{this.calculateTotal(land)}</th>
										</tr>
									</tfoot>
								</table>
								<br />

							</Fragment>

						})}
						<table className="table table-responsize">
							<tfoot>
								<tr>
									<th className="col-6"></th>
									<th className="col-6">£{arableTotalValue ? arableTotalValue.toFixed(2) : "0.00"}</th>
								</tr>
							</tfoot>
						</table>

						<h5 className="font-weight-bold">Livestock</h5>
						<p>The following is a breakdown of all livestock and their associated value.</p>
						<br />
						{animalTypes.map(animalTypeName => {


							

							return <Fragment key={animalTypeName} >

								<h6 className="font-weight-bold">{_.startCase(animalTypeName)}</h6>
								<table className="table table-responsize">
									<tbody>
										
										{animals.map(animal => {

											if(animal.type.name === animalTypeName) {

											livestockTotalValue += (animal.quantity*animal.value);

											return 	<tr key={animal.id}>
														<td className="col-6">{animal.quantity}x {_.startCase(animal.breed.name) + " " +_.startCase(animal.gender.name) + (animal.quantity > 1 ? "s" : "")}</td>
														<td className="col-6">£{(animal.quantity*animal.value).toFixed(2)}</td>
													</tr>

											}

										})}
									</tbody>
									<tfoot>
										<tr>
											<th className="col-6"></th>
											<th className="col-6">£{livestockTotalValue.toFixed(2)}</th>
										</tr>
									</tfoot>
								</table>
								<br />

							</Fragment>

							})}
						<h5 className="font-weight-bold">Stock</h5>
						<p>The following is a breakdown of all stock, quantity and associated value.</p>
						<br />


	
						<table className="table table-responsize">
							<tbody>
								{listStock.map(stock => {

									stockTotalValue += (stock.value * stock.quantity);

									return 	<tr key={stock.id}>
												<td className="col-6">{stock.quantity}x {_.startCase(stock.name)}</td>
												<td className="col-6">£{(stock.value * stock.quantity).toFixed(2)}</td>
											</tr>

									

								})}
							</tbody>
							<tfoot>
								<tr>
									<th className="col-6"></th>
									<th className="col-6">£{stockTotalValue.toFixed(2)}</th>
								</tr>
							</tfoot>
						</table>
						<br />
						<table className="table table-responsize">
							<tfoot>
								<tr>
									<th className="col-6"></th>
									<th className="col-6">£{(arableTotalValue + livestockTotalValue + stockTotalValue).toFixed(2)}</th>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />

			</Dashboard>
		);
	}
}


export default compose(
	graphql(gql`

		query {
			listLands {
				id
				name
				size
				seedCost
				fertiliserCost
				limeCost
				sprayCost
				cultivationCost
				licenceCost
				jobs {
					type {
						name
					}
				}
			}
		}
	
	`, {
		name: "listLands"
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
)(Report);
