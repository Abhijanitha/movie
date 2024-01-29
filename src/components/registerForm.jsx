import React, { Component } from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import * as userService from '../services/userService'
import auth from '../services/authService'

class RegisterForm extends Form {
  state = {
    data: { username: "", password: "" ,name: ""},
    errors: {},
  };
  schema = {
    username: Joi.string().required().email().label("Username"),
    password: Joi.string().required().min(5).label("Password"),
    name: Joi.string().required().label("Name")
  };
  //errors['username'] or if we are having an array then errors.find(e=>e.name==='username') that is why to avoid this we will be using an object of errors.
  //   username = React.createRef();
  // componentDidMount(){
  //     this.username.current.focus();
  // }
// ...

doSubmit = async () => {
  console.log("Submitted");
  try {
    const response = await userService.register(this.state.data);
    console.log('Response:', response);
    const { headers } = response;
    console.log('Headers:', headers);
    if (headers && headers['x-auth-token']) {
      auth.loginWithJwt(headers['x-auth-token']);
      window.location = '/';
    } else {
      console.error('Token not found in response headers.');
    }
  } catch (ex) {
    console.error('Error during registration:', ex);
    if (ex.response && ex.response.status === 400) {
      const errors = { ...this.state.errors };
      errors.username = ex.response.data; // Update to use 'email' instead of 'username'
      this.setState({ errors });
    }
  }
};


// ...

  

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('username','Username')}
          {this.renderInput('password','Password','password')}
          {this.renderInput('name','Name')}
          {this.renderButton('Register')}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
