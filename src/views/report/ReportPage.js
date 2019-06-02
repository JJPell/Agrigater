import React, { Component, Fragment } from 'react';
import _ from "lodash";

import Dashboard from "../layout/Dashboard";

import { Grow, CircularProgress } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

import { isAuthenticated, isToken, redirectToSignIn } from "../../Auth";

import axios from 'axios';

import config from "../../config";


const styles = theme => ({
	root: {
	  ...theme.mixins.gutters(),
	  paddingTop: theme.spacing.unit * 2,
	  paddingBottom: theme.spacing.unit * 2,
	},
  });


class ReportPage extends Component {

	baseUrl = config.api;
	token = localStorage.getItem("token");

	constructor() {
		super();
		this.state = {
			pdf: '',
			loaded: false
		}
	}

	componentWillMount() {
		isToken(this);
	}
	componentWillUnmount() {
		URL.revokeObjectURL(this.pdf);
	}
	componentDidMount() {
		this.downloadPDF();
	}

	base64ToArrayBuffer(data) {
		var binaryString = window.atob(data);
		var binaryLen = binaryString.length;
		var bytes = new Uint8Array(binaryLen);
		for (var i = 0; i < binaryLen; i++) {
			var ascii = binaryString.charCodeAt(i);
			bytes[i] = ascii;
		}
		return bytes;
	};

	downloadPDF = () => {

		const instance = axios.create({
			baseURL: this.baseUrl,
			timeout: 10000,
			headers: {'authorisation': this.token}
		});

		//console.log(instance);
		instance.get('/pdf').then(response => {

			console.log("response");
			console.log(response);
			console.log(response.data);

			let binaryData = [this.base64ToArrayBuffer(response.data)];
			//let pdfBlob = new Blob(binaryData, {type: response.headers['content-type']});
			let pdfFile = new File(binaryData, "Valuation Report", {type: response.headers['content-type']});

			console.log("pdfFile", pdfFile)

			this.setState({
				pdf: URL.createObjectURL(pdfFile),
				loaded: true,
			});

		}).catch(error => {
			console.log("err")
			console.log(error)

			if(error.response && error.response.status == 401) {
				redirectToSignIn(this);
			} else {
				this.setState({
					loaded: true,
				});
			}
		});

	}

	render() {
		
		isAuthenticated(this);
		const { classes } = this.props;
		const { pdf } = this.state;

		const loaded = this.state.loaded;

		return (
			<Dashboard hideSidebar={true} history={this}>
				{!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} className={classes.progress} size={50} /> : null}
				<Grow in={loaded}>
					<object style={{width: "calc(100% + 48px)", height: "calc(100% - 16px)", margin: "-24px"}} data={pdf} type="application/pdf">
							<iframe src={pdf} style={{width: "calc(100% + 48px)", height: "calc(100% - 16px)", margin: "-24px"}}></iframe>
					</object>
				</Grow>
			</Dashboard>
		);
	}
}

export default withStyles(styles)(ReportPage);
