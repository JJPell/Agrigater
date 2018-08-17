import React, { Component } from 'react';
import { graphql } from "react-apollo";
import styled from 'styled-components';
import loginImg from '../../img/login-screen.jpg';
import Form from "./Form";

import { Paper } from "@material-ui/core";

class SignIn extends Component {

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
					<div className="col-sm-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
						<Paper>
							<div className="card-body">
								<Form history={history} />
							</div>
						</Paper>
					</div>
				</div>

				</div>
			</Background>
		)
	}
}


export default SignIn;