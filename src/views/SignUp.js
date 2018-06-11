import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import styled from 'styled-components';

import loginImg from '../img/login-screen.jpg';



class SignUp extends Component {

  constructor(props) {

    super(props);

    this.signIn = this.signIn.bind(this);

  }
  state = {
    username: '',
    password: '',
    user: {},
    authCode: ''
  }
  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(user => {
        //this.props.navigation.navigate('AppNav')
        console.log("currentAuthenticatedUser")
      })
      .catch(err => console.log('err: ', err))
  }
  onUsernameChange(event) {
    this.setState({ "username": event.target.value })
  }
  onPasswordChange(event) {
    this.setState({ "password": event.target.value })
  }
  signIn = () => {

//    console.log("test");
    const { username, password } = this.state
    Auth.signIn(username, password)
      .then(user => {
        console.log('successful sign in!');
        console.log(user);
        this.setState({ user });
      })
      .catch(err => {
        console.log('error signin in!: ', err)
      })
  }
  render() {

	const Background = styled.div`
		background-image: url(${loginImg});
		background-position: center;
		padding-top: 25vh;
		height: 100vh;
		`;

    return (
		<Background>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
              <div className="card">
                <div className="card-body">
                  <form className="form">
                    <h1 className="form-signin-heading">Sign Up</h1>
                    <label htmlFor="input-email" className="sr-only" >Email</label>
                    <input type="text" id="input-email" className="form-control" onChange={this.onUsernameChange.bind(this)} placeholder="Email address" required />
                    <label htmlFor="input-email-confirm" className="sr-only" >Confirm Email</label>
                    <input type="text" id="input-email" className="form-control" onChange={this.onUsernameChange.bind(this)} placeholder="Confirm Email address" required />
                    <label htmlFor="input-password" className="sr-only" >Password</label>
                    <input type="password" id="input-password" className="form-control" onChange={this.onPasswordChange.bind(this)} placeholder="Password" required />
                    <label htmlFor="input-password" className="sr-only" >Confirm Password</label>
                    <input type="password" id="input-password" className="form-control" onChange={this.onPasswordChange.bind(this)} placeholder="Confirm Password" required />
                    <button className="btn btn-primary btn-block" type="button" onClick={this.signIn}>Sign Up</button>
                    <span className="text-danger" />
                    <hr />
                    <h3>Already have an account?</h3>
                    <a href="/signin" className="btn btn-primary btn-block">Sign In</a>
                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
		</Background>
    )
  }
}


export default SignUp;