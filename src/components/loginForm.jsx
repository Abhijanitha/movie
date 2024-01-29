import React, { Component } from "react";
import Joi, { errors } from "joi-browser";
import Form from "./common/form";
import auth from '../services/authService'
import {Redirect} from 'react-router-dom'

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
  };
  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };
  //errors['username'] or if we are having an array then errors.find(e=>e.name==='username') that is why to avoid this we will be using an object of errors.
  //   username = React.createRef();
  // componentDidMount(){
  //     this.username.current.focus();
  // }
  doSubmit=async()=>{
    console.log("Submitted");
    try {
      const {data}=this.state;
      await auth.login(data.username,data.password);
      // console.log(jwt);
      // this.props.history.push('/');
      const {state}=this.props.location;
      window.location=state?state.from.pathname:'/';
    } catch (ex) {
      if(ex.response&&ex.response.status===400){
        const errors={...this.state.errors};
        errors.username=ex.response.dtaa;
        this.setState({errors});
      }
    }
  }

  render() {
    if(auth.getCurrentUser()) return <Redirect to='/'/>
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('username','Username')}
          {this.renderInput('password','Password','password')}
          {this.renderButton('Login')}
        </form>
      </div>
    );
  }
}

export default LoginForm;
