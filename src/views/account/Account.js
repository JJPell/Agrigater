import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import FontAwesome from 'react-fontawesome';
import _ from "lodash";

import Dashboard from "../layout/Dashboard";

import PropTypes from 'prop-types';
import { Paper, Button, Grow, CircularProgress } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';


import { isAuthenticated, isToken } from "../../Auth";


const styles = theme => ({
	root: {
	  ...theme.mixins.gutters(),
	  paddingTop: theme.spacing.unit * 2,
	  paddingBottom: theme.spacing.unit * 2,
	},
	avatar: {
		width: "22%",
		height: "auto",
		marginLeft: "auto",
		marginRight: "auto"
	}
});

class Account extends Component {

	constructor() {
		super();
		
		this.profile = JSON.parse(localStorage.getItem("profile"));

		console.log(this.profile)
	}


	render() {

		const { classes } = this.props;
		const loaded = true;

		console.log(this.props)

		//const loaded = !this.props.listFarms.loading && !this.props.listAnimals.loading && !this.props.listStock.loading;

		return (

			<Dashboard hideSidebar={true} history={this}>
				{!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} className={classes.progress} size={50} /> : null}
				<br />
				<Grow in={loaded}>

						<div className="row">
							<Paper className="offset-md-2 col-md-8 offset-lg-4 col-lg-4">

								<div className="card-body">
									<Avatar alt={this.profile.name} src={this.profile.picture} className={classes.avatar} />
									<h4>Profile</h4>
									<hr />

									<div className="row">
										<div className="col-sm-6">
											Name
										</div>
										<div className="col-sm-6 text-right">
											{this.profile.name}
										</div>
									</div>
									<div className="row">
										<div className="col-sm-6">
											Email
										</div>
										<div className="col-sm-6  text-right">
											{this.profile.email}
										</div>
									</div>
									<div className="row">
										<div className="col-sm-6">
											Last Updated
										</div>
										<div className="col-sm-6 text-right">
											{moment(this.profile.updated_at).fromNow()}
										</div>
									</div>
								</div>
							</Paper>
						</div>

				</Grow>
				
			</Dashboard>

		);
	}
}

export default withStyles(styles)(Account);
