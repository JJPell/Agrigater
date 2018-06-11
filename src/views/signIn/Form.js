import React, { Component } from 'react';
import { graphql } from "react-apollo";
import getToken from "../../queries/getToken";


class Form extends Component {

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
        console.log(this.props)
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

		const { inputChange, signIn } = this;
		const { email, password } = this.state;

		return (
			
            <form className="form">
                <h1 className="form-signin-heading">Sign In</h1>
                <label htmlFor="input-email" className="sr-only" >Email</label>
                <input
                    className="form-control"
                    name="email"
                    onChange={inputChange}
                    value={email}
                    placeholder="Email"
                />						
                <label htmlFor="input-password" className="sr-only" >Password</label>
                <input
                    className="form-control"
                    name="password"
                    onChange={inputChange}
                    value={password}
                    type="password"
                    placeholder="Password"
                />
                <button className="btn btn-primary btn-block" type="button" onClick={signIn}>Sign In</button>
                <span className="text-danger" />
                <hr />
                <h3>Haven't got an account?</h3>
                <a href="/signup" className="btn btn-primary btn-block">Sign Up</a>
            </form>

		)
	}
}


export default graphql(getToken, {
	options: {
		variables: {
			email: "",
			password: ""
		},
		fetchPolicy: "cache-and-network",
		skip: true
	}
})(Form);