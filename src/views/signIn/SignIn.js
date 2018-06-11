import React, { Component } from 'react';
import { graphql } from "react-apollo";
import styled from 'styled-components';
import loginImg from '../../img/login-screen.jpg';
import Form from "./Form";

const Input = styled.input``;

class SignIn extends Component {

	state = {
		email: '',
		password: ''
	}

	// componentDidMount() {
	// 	// Add redirect here if already has token.
	// }

	inputChange = event => {
		
		const {name, value} = event.target;
		
		this.setState({[name]: value});
		console.log(this.state);
	}

	signIn = (event) => {

		this.props.data.refetch({
			...this.state
		}).then(response => {
			const token = response.data.getToken;
			if(token === "Unauthorised") {

			} else {
				localStorage.setItem("token", `Bearer ${token}`);
				this.props.history.replace("/");
			}

		});
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
					<div className="col-sm-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
					<div className="card">
						<div className="card-body">
							<Form history={history} />
						</div>
					</div>
					</div>
				</div>

				</div>
			</Background>
		)
	}
}


export default SignIn;