import React, { Component } from 'react';
import { graphql } from "react-apollo";
import getToken from "../../queries/getToken";


import { TextField, Button, Typography } from "@material-ui/core";


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
                <Typography variant="display2">Sign In</Typography>
				<br />
                <label htmlFor="input-email" className="sr-only" >Email</label>
                <TextField
                    fullWidth
                    name="email"
                    onChange={inputChange}
                    value={email}
					label="Email"
					autoComplete="current-email"
                />
				<br />
				<br />						
                <label htmlFor="input-password" className="sr-only" >Password</label>
                <TextField
                    fullWidth
					label="Password"
					name="password"
					type="password"
                    onChange={inputChange}
                    value={password}
                    autoComplete="current-password"
    
                />
				<br />
				<br />
                <Button color="primary" variant="contained" fullWidth onClick={signIn}>Sign In</Button>
                <span className="text-danger" />
				<br />
                <hr />

                <Typography variant="subheading">Haven't got an account?</Typography>
                <Button variant="contained" diabled fullWidth>Sign Up</Button>
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