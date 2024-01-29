import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };
  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;
    const errors = {};
    //mapping an array into an object
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;

    // const { data } = this.state;
    // if (data.username.trim() === "")
    //   errors.username = "Username is required";
    // if (data.password.trim() === "")
    //   errors.password = "Password is required";

    // return Object.keys(errors).length === 0 ? null : errors;
  };
  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
    // if (name === "username") {
    //   if (value.trim() === "") return "Username is required";
    // }
    // if (name === "password") {
    //   if (value.trim() === "") return "Password is required";
    // }
    // // If the value is not empty, clear the error for the current property
    // return null;
  };
  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    console.log(errors);
    this.setState({ errors: errors || {} });
    if (errors) return;

    //call the server,save the changes,redirect the user to the different page
    //javascript:
    // const username=document.getElementById('username').value;
    //but in react we will not use DOM-document object model
    // const username=this.username.current.value;
    console.log("submitted");
  };
  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    // Clear the error for the current property if the value is not empty
    if (errorMessage === null) {
      delete errors[input.name];
    } else {
      errors[input.name] = errorMessage;
    }

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };
  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }
  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
  renderSelect(name, label, options) {
    const { data, errors } = this.state;
  
    // Ensure options is defined and is an array before rendering the Select
    if (!options || !Array.isArray(options)) {
      console.error("Invalid options provided for Select component.");
      return null;
    }
  
    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
}

export default Form;
