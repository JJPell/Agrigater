import React, { Component } from 'react';
import { graphql } from "react-apollo";
import styled from 'styled-components';
import loginImg from '../../img/login-screen.jpg';

import { Paper } from "@material-ui/core";

import Auth0Lock from "auth0-lock";


class SignIn extends Component {

	lock = new Auth0Lock(
		'h8y1nngoBIs1w4ISTxMT2xbt9YaDv3KW',
		'agrigater.auth0.com',
		{			
			languageDictionary: {
				title: "",
				signUpTerms: "I agree to the <a href='https://my-app-url.com/terms' target='_new'>terms of service</a> and <a href='https://my-app-url.com/privacy' target='_new'>privacy policy</a>."
			},
			container: "auth0-container",
			theme: {
				logo: process.env.PUBLIC_URL+'/img/logo/ColorVersion.png',
				primaryColor: '#00854f'
			},
			rememberLastLogin: true,
			auth: {
				audience: "agrigater",
				redirect: false
			},
			mustAcceptTerms: true,
		}
	)

	constructor() {

		super();

		this.onAuthenticated = this.onAuthenticated.bind(this);

		this.onAuthenticated();
		
	}

	onAuthenticated() {

		let self = this;
		this.lock.on("authenticated", (function(authResult) {
			// Use the token in authResult to getUserInfo() and save it to localStorage
			self.lock.getUserInfo(authResult.accessToken, function(error, profile) {
			  if (error) {
				console.error(error);
				return;
			  }
		
			  console.log(authResult);
			//   console.log(profile);
		
			  localStorage.setItem("token", `Bearer ${authResult.accessToken}`);
			  localStorage.setItem('profile', JSON.stringify(profile));
			  self.props.history.replace("/");
			});
		}));
	}

	componentDidMount() {
		this.lock.show();
	}

	render() {

		const Background = styled.div`
			background-image: url(${loginImg});
			background-position: center;
			padding-top: 25vh;
			height: 100vh;
		`;

		const { history } = this.props;

		return (
			
			<Background>
				<div className="container">
				<div className="row">
					<div id="auth0-container" className="col-sm-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">

					</div>
				</div>

				</div>
			</Background>
		)
	}
}


export default SignIn;